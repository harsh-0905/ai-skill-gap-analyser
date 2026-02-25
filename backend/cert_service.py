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
    }
}


def get_certificate(skill):
    return CERT_DB.get(skill.lower(), {
        "name": "No certificate available",
        "link": ""
    })