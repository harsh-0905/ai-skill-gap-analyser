def extract_skills(text, skills_list):
    """
    Case-insensitive skill extraction with alias matching.
    No spaCy needed — simple but effective for keyword matching.
    """
    text_lower = text.lower()
    found = []

    # Alias map — maps variations to canonical skill names in skills_list
    ALIASES = {
        # Node
        "node.js": "node", "nodejs": "node", "node js": "node",

        # React
        "react.js": "react", "reactjs": "react", "react js": "react",

        # Vue / Nuxt / Next
        "vue.js": "vue", "vuejs": "vue",
        "next.js": "next.js",   # next.js is now directly in skills list
        "nuxt.js": "nuxtjs",

        # Express
        "express.js": "express", "expressjs": "express",

        # MongoDB
        "mongo": "mongodb", "mongo db": "mongodb",

        # PostgreSQL
        "postgres": "postgresql", "pg": "postgresql",

        # Kubernetes
        "k8s": "kubernetes", "kube": "kubernetes",

        # Cloud
        "gcp": "google cloud", "google cloud platform": "google cloud",
        "amazon web services": "aws", "amazon s3": "aws",
        "ms azure": "azure", "microsoft azure": "azure",

        # ML / AI
        "tf": "tensorflow", "keras": "tensorflow",
        "sklearn": "scikit-learn", "scikit learn": "scikit-learn",
        "ml": "machine learning",
        "dl": "deep learning",
        "llm": "large language models", "llms": "large language models",
        "gen ai": "generative ai", "genai": "generative ai",
        "rag": "retrieval augmented generation",
        "nlp": "natural language processing",
        "cv": "computer vision",
        "hugging face": "huggingface",
        "huggingface transformers": "huggingface transformers",
        "fine tuning": "fine-tuning", "finetuning": "fine-tuning",
        "vector database": "vector db",
        "pinecone": "pinecone",   # pinecone now directly in skills list
        "weaviate": "weaviate",   # weaviate now directly in skills list
        "langchain": "langchain",
        "prompt engineering": "prompt engineering",

        # Languages
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "c sharp": "c#", "csharp": "c#",
        "c plus plus": "c++", "cpp": "c++",

        # REST
        "restful": "rest api", "rest": "rest api", "restful api": "rest api",
        "restful apis": "rest apis",
        "graphql api": "graphql",

        # CI/CD — keep jenkins separate so DevOps scoring works
        "ci cd": "ci/cd", "cicd": "ci/cd", "continuous integration": "ci/cd",
        "github actions": "ci/cd", "gitlab ci": "ci/cd",
        # NOTE: "jenkins" is NOT aliased to ci/cd anymore.
        # It stays as "jenkins" so DEVOPS_SIGNALS in main.py can detect it.

        # Linux / Bash
        "linux server": "linux", "ubuntu": "linux", "centos": "linux",
        "bash scripting": "bash", "shell scripting": "bash",
        "linux administration": "linux administration",

        # CSS / Tailwind
        "tailwind": "tailwind css", "tailwindcss": "tailwind css",
        "sass": "sass", "scss": "sass",

        # Frontend
        "redux toolkit": "redux",
        "flutter dart": "flutter",
        "android studio": "android",
        "xcode": "ios",

        # Serverless / Microservices
        "aws lambda": "serverless", "azure functions": "serverless",
        "microservice": "microservices",

        # Queues / Cache
        "message queue": "rabbitmq", "kafka queue": "kafka",
        "elastic search": "elasticsearch",
        "redis cache": "redis",

        # CS Fundamentals
        "data structures": "dsa", "algorithms": "dsa",
        "data structures and algorithms": "dsa",
        "object oriented": "oop", "oops": "oop",
        "object oriented programming": "oop",
        "agile methodology": "agile", "scrum methodology": "agile",

        # DevOps roles
        "devops engineer": "devops",

        # FastAPI
        "fast api": "fastapi",

        # NLP tools
        "spacy": "spacy",
        "tf-idf": "tfidf", "tf idf": "tfidf",

        # Auth
        "role based access control": "rbac",
        "json web token": "jwt", "json web tokens": "jwt",
        "oauth 2.0": "oauth2", "oauth 2": "oauth2",

        # Deployment
        "vercel deployment": "vercel",
        "render deployment": "render",

        # DevOps tools (kept as direct matches, not merged into ci/cd)
        "helm chart": "helm",
        "grafana dashboard": "grafana",
        "prometheus monitoring": "prometheus",
    }

    skills_lower = {s.lower(): s for s in skills_list}

    # Direct match — check if skill appears in text
    for skill_lower, skill_original in skills_lower.items():
        if skill_lower in text_lower:
            found.append(skill_original)

    # Alias match — check if alias appears in text, map to canonical
    for alias, canonical in ALIASES.items():
        canonical_lower = canonical.lower()
        if alias in text_lower and canonical_lower in skills_lower:
            canonical_original = skills_lower[canonical_lower]
            if canonical_original not in found:
                found.append(canonical_original)

    return list(set(found))