TIME_DB = {
    # Frontend
    "html": "3 days", "css": "1 week", "tailwind css": "3 days",
    "javascript": "4 weeks", "typescript": "2 weeks",
    "react": "3 weeks", "nextjs": "2 weeks", "vue": "3 weeks",
    "nuxtjs": "2 weeks", "angular": "4 weeks", "svelte": "2 weeks",
    "redux": "1 week", "figma": "1 week", "react native": "3 weeks",

    # Backend
    "python": "3 weeks", "node": "3 weeks", "express": "1 week",
    "fastapi": "1 week", "django": "3 weeks", "flask": "2 weeks",
    "java": "6 weeks", "spring boot": "3 weeks", "c#": "4 weeks",
    "go": "3 weeks", "rust": "4 weeks", "php": "3 weeks",
    "graphql": "1 week", "rest apis": "1 week", "grpc": "2 weeks",

    # Database
    "sql": "2 weeks", "postgresql": "2 weeks", "mysql": "2 weeks",
    "mongodb": "2 weeks", "redis": "1 week", "elasticsearch": "2 weeks",
    "firebase": "1 week", "dynamodb": "2 weeks", "cassandra": "3 weeks",

    # DevOps & Cloud
    "git": "3 days", "linux": "2 weeks", "bash": "1 week",
    "docker": "1 week", "kubernetes": "3 weeks",
    "aws": "4 weeks", "azure": "3 weeks", "google cloud": "3 weeks",
    "terraform": "2 weeks", "ansible": "2 weeks", "ci/cd": "2 weeks",
    "devops": "8 weeks", "nginx": "3 days",

    # AI / ML
    "machine learning": "8 weeks", "deep learning": "8 weeks",
    "natural language processing": "6 weeks", "computer vision": "6 weeks",
    "generative ai": "3 weeks", "large language models": "4 weeks",
    "retrieval augmented generation": "2 weeks", "fine-tuning": "2 weeks",
    "prompt engineering": "1 week", "langchain": "2 weeks",
    "tensorflow": "4 weeks", "pytorch": "4 weeks",
    "scikit-learn": "2 weeks", "huggingface": "2 weeks",
    "openai api": "1 week", "mlops": "4 weeks",
    "vector db": "1 week", "pandas": "2 weeks", "numpy": "1 week",

    # Data Engineering
    "apache spark": "4 weeks", "airflow": "2 weeks",
    "data pipeline": "3 weeks", "power bi": "2 weeks", "tableau": "2 weeks",

    # Mobile
    "flutter": "4 weeks", "android": "6 weeks",
    "ios": "6 weeks", "kotlin": "4 weeks", "swift": "4 weeks",

    # System / Architecture
    "dsa": "8 weeks", "system design": "4 weeks",
    "microservices": "3 weeks", "oop": "2 weeks",
    "kafka": "2 weeks", "rabbitmq": "1 week", "serverless": "1 week",

    # Security
    "cybersecurity": "8 weeks", "penetration testing": "6 weeks",
    "network security": "4 weeks",

    # Testing
    "jest": "1 week", "pytest": "1 week",
    "selenium": "2 weeks", "cypress": "1 week", "unit testing": "1 week",

    # Blockchain
    "blockchain": "4 weeks", "solidity": "4 weeks",

    # Misc
    "agile": "1 week", "c++": "6 weeks",
    "typescript": "2 weeks", "git": "3 days",
}

def get_learning_time(skill):
    return TIME_DB.get(skill.lower(), "2 weeks")