from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import pdfplumber
from docx import Document
import io

app = FastAPI()

def extract_text_from_image(image_bytes):
    """Extract text from an image file."""
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text.strip()

def extract_text_from_pdf(pdf_bytes):
    """Extract text from a PDF file."""
    text = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def extract_text_from_docx(docx_bytes):
    """Extract text from a DOCX file."""
    doc = Document(io.BytesIO(docx_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.strip()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_bytes = await file.read()
    file_type = file.content_type

    if file_type in ["image/png", "image/jpeg", "image/jpg"]:
        extracted_text = extract_text_from_image(file_bytes)
    elif file_type == "application/pdf":
        extracted_text = extract_text_from_pdf(file_bytes)
    elif file_type in ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        extracted_text = extract_text_from_docx(file_bytes)
    elif file_type == "text/plain":
        extracted_text = file_bytes.decode("utf-8")
    else:
        return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    print("Extracted Text:", extracted_text)  # Prints extracted text to terminal
    return {"text": extracted_text}

@app.post("/text/")
async def receive_text(text: str = Form(...)):
    print("Received Text:", text)
    return {"text": text}