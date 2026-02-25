TIME_DB = {
    "docker": "1 week",
    "kubernetes": "3 weeks",
    "aws": "4 weeks",
    "azure": "3 weeks",
    "ci/cd": "2 weeks",
    "react": "3 weeks"
}

def get_learning_time(skill):
    return TIME_DB.get(skill.lower(), "2 weeks")