CERT_DB = {
    "docker": {
        "name": "Docker Certified Associate",
        "link": "https://www.udemy.com/course/docker-mastery/"
    },
    "kubernetes": {
        "name": "Certified Kubernetes Administrator (CKA)",
        "link": "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/"
    },
    "aws": {
        "name": "AWS Solutions Architect Associate",
        "link": "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect"
    },
    "azure": {
        "name": "Microsoft Azure Fundamentals (AZ-900)",
        "link": "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/"
    },
    "ci/cd": {
        "name": "CI/CD with Jenkins",
        "link": "https://www.coursera.org/learn/continuous-integration-continuous-delivery"
    },
    "react": {
        "name": "Meta Frontend Developer Certificate",
        "link": "https://www.coursera.org/professional-certificates/meta-front-end-developer"
    },
    "python": {
        "name": "Python for Everybody Specialization",
        "link": "https://www.coursera.org/specializations/python"
    },
    "nodejs": {
        "name": "Node.js Developer Course",
        "link": "https://www.udemy.com/course/nodejs-the-complete-guide/"
    },
    "mongodb": {
        "name": "MongoDB Developer Certification",
        "link": "https://learn.mongodb.com/"
    },
    "angular": {
        "name": "Angular - The Complete Guide",
        "link": "https://www.udemy.com/course/the-complete-guide-to-angular-2/"
    },
    "data-structures": {
        "name": "Data Structures and Algorithms",
        "link": "https://www.coursera.org/specializations/data-structures-algorithms"
    },
    "system-design": {
        "name": "System Design Fundamentals",
        "link": "https://www.udemy.com/course/system-design-interview-guide/"
    },
    "git": {
        "name": "Git and GitHub Bootcamp",
        "link": "https://www.udemy.com/course/git-and-github-bootcamp/"
    },
    "linux": {
        "name": "Linux Essentials",
        "link": "https://www.netacad.com/courses/os-it/linux-essentials"
    },
    "devops": {
        "name": "DevOps Engineer Course",
        "link": "https://www.coursera.org/professional-certificates/devops"
    },
    "sql": {
        "name": "SQL for Data Science",
        "link": "https://www.coursera.org/learn/sql-for-data-science"
    },
    "ai": {
        "name": "AI For Everyone - Andrew Ng",
        "link": "https://www.coursera.org/learn/ai-for-everyone"
    },
    "machine-learning": {
        "name": "Machine Learning Specialization - Andrew Ng",
        "link": "https://www.coursera.org/specializations/machine-learning-introduction"
    },
    "deep-learning": {
        "name": "Deep Learning Specialization",
        "link": "https://www.coursera.org/specializations/deep-learning"
    },
    "generative-ai": {
        "name": "Generative AI with LLMs",
        "link": "https://www.coursera.org/learn/generative-ai-with-llms"
    },
    "nlp": {
        "name": "Natural Language Processing Specialization",
        "link": "https://www.coursera.org/specializations/natural-language-processing"
    },
    "ai-engineer": {
        "name": "AI Engineer Professional Certificate",
        "link": "https://www.coursera.org/professional-certificates/ai-engineer"
    }
    }


def get_certificate(skill):
    return CERT_DB.get(skill.lower(), {
        "name": "No certificate available",
        "link": ""
    })