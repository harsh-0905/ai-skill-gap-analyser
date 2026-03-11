import PyPDF2
from io import BytesIO

def extract_text_from_pdf(file):
    try:
        # Read uploaded file bytes
        file_bytes = file.read()

        # Convert to BytesIO stream
        pdf_stream = BytesIO(file_bytes)

        # Read PDF
        reader = PyPDF2.PdfReader(pdf_stream)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        return text.lower()

    except Exception as e:
        print("PDF parsing error:", e)
        return ""