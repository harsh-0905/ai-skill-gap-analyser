def extract_skills(text, skills_list):
    """
    Case-insensitive skill extraction with alias matching.
    No spaCy needed — simple but effective for keyword matching.
    """
    text_lower = text.lower()
    found = []

    # Alias map — maps variations to canonical skill names in skills_list
    ALIASES = {
        "node.js": "node", "nodejs": "node", "node js": "node",
        "react.js": "react", "reactjs": "react", "react js": "react",
        "vue.js": "vue", "vuejs": "vue",
        "next.js": "nextjs", "nuxt.js": "nuxtjs",
        "express.js": "express", "expressjs": "express",
        "mongo": "mongodb", "mongo db": "mongodb",
        "postgres": "postgresql", "pg": "postgresql",
        "k8s": "kubernetes", "kube": "kubernetes",
        "gcp": "google cloud", "google cloud platform": "google cloud",
        "amazon web services": "aws", "amazon s3": "aws",
        "ms azure": "azure", "microsoft azure": "azure",
        "tf": "tensorflow", "keras": "tensorflow",
        "sklearn": "scikit-learn", "scikit learn": "scikit-learn",
        "ml": "machine learning",
        "dl": "deep learning",
        "llm": "large language models", "llms": "large language models",
        "gen ai": "generative ai", "genai": "generative ai",
        "rag": "retrieval augmented generation",
        "nlp": "natural language processing",
        "cv": "computer vision",
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "c sharp": "c#", "csharp": "c#",
        "c plus plus": "c++", "cpp": "c++",
        "rest api": "rest apis", "restful": "rest apis", "rest": "rest apis",
        "graphql api": "graphql",
        "ci cd": "ci/cd", "cicd": "ci/cd", "continuous integration": "ci/cd",
        "github actions": "ci/cd", "jenkins": "ci/cd", "gitlab ci": "ci/cd",
        "linux server": "linux", "ubuntu": "linux", "centos": "linux",
        "bash scripting": "bash", "shell scripting": "bash",
        "tailwind": "tailwind css", "tailwindcss": "tailwind css",
        "sass": "css", "scss": "css",
        "redux toolkit": "redux",
        "react native": "react native",
        "flutter dart": "flutter",
        "android studio": "android",
        "xcode": "ios",
        "aws lambda": "serverless", "azure functions": "serverless",
        "microservice": "microservices",
        "message queue": "rabbitmq", "kafka queue": "kafka",
        "elastic search": "elasticsearch",
        "redis cache": "redis",
        "data structures": "dsa", "algorithms": "dsa", "data structures and algorithms": "dsa",
        "system design": "system design",
        "object oriented": "oop", "oops": "oop", "object oriented programming": "oop",
        "agile methodology": "agile", "scrum methodology": "agile",
        "devops engineer": "devops",
        "mlops": "mlops",
        "prompt engineering": "prompt engineering",
        "langchain": "langchain",
        "vector database": "vector db", "pinecone": "vector db", "weaviate": "vector db",
        "fine tuning": "fine-tuning", "finetuning": "fine-tuning",
        "hugging face": "huggingface",
        "fast api": "fastapi",
    }

    skills_lower = {s.lower(): s for s in skills_list}

    for skill_lower, skill_original in skills_lower.items():
        if skill_lower in text_lower:
            found.append(skill_original)
            continue

    # Check aliases
    for alias, canonical in ALIASES.items():
        if alias in text_lower and canonical in skills_lower and skills_lower[canonical] not in found:
            found.append(skills_lower[canonical])

    return list(set(found))