from courses_data import COURSE_DB
def convert_to_weeks(time_str):
    num = int(time_str.split()[0])

    if "week" in time_str:
        return num
    if "month" in time_str:
        return num * 4

    return num


def analyse_gap(student_skills, required_skills):

    student_skills = set(student_skills)
    required_skills = set(required_skills)

    matched = list(student_skills & required_skills)
    missing = list(required_skills - student_skills)

    match_percent = (len(matched) / len(required_skills)) * 100 if required_skills else 0

    #  LEARNING PATH + TIME CALCULATION
    learning_path = []
    total_weeks = 0

    for skill in missing:
        if skill in COURSE_DB:
            time_needed = COURSE_DB[skill]["time_to_learn"]

            weeks = convert_to_weeks(time_needed)
            total_weeks += weeks

            learning_path.append(f"{skill} → {time_needed}")

    #  JOB READINESS SCORE
    job_readiness = int((len(matched) / len(required_skills)) * 100) if required_skills else 0

    return {
        "match_percentage": round(match_percent, 2),
        "matched_skills": matched,
        "missing_skills": missing,
        "job_readiness": f"{job_readiness}%",
        "estimated_time_to_job_ready": f"{total_weeks} weeks",
        "learning_path": learning_path
    }