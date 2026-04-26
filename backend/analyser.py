from learning_time_service import TIME_DB

def convert_to_weeks(time_str):
    """Convert a time string like '2 weeks', '3 days', '1 month' to weeks (float)."""
    time_str = time_str.strip().lower()
    parts = time_str.split()
    if not parts:
        return 1

    try:
        num = float(parts[0])
    except ValueError:
        return 1

    if "day" in time_str:
        return round(num / 7, 2)
    if "month" in time_str:
        return num * 4
    # default: weeks
    return num


def analyse_gap(student_skills, required_skills):

    student_skills = set(student_skills)
    required_skills = set(required_skills)

    matched = list(student_skills & required_skills)
    missing = list(required_skills - student_skills)

    match_percent = (len(matched) / len(required_skills)) * 100 if required_skills else 0

    # LEARNING PATH + TIME CALCULATION
    # Use TIME_DB (comprehensive) instead of old COURSE_DB (only 5 skills)
    # so missing skills always get a time estimate — never stuck at 0 weeks.
    learning_path = []
    total_weeks = 0.0

    for skill in missing:
        skill_lower = skill.lower()
        # Look up in TIME_DB; fall back to 2 weeks if skill not found
        time_needed = TIME_DB.get(skill_lower, "2 weeks")
        weeks = convert_to_weeks(time_needed)
        total_weeks += weeks
        learning_path.append(f"{skill} → {time_needed}")

    # Round total: if less than 1 week, show in days
    if total_weeks < 1 and total_weeks > 0:
        total_display = f"{round(total_weeks * 7)} days"
    else:
        total_display = f"{round(total_weeks)} weeks"

    # JOB READINESS SCORE
    job_readiness = int((len(matched) / len(required_skills)) * 100) if required_skills else 0

    return {
        "match_percentage": round(match_percent, 2),
        "matched_skills": matched,
        "missing_skills": missing,
        "job_readiness": f"{job_readiness}%",
        "estimated_time_to_job_ready": total_display,
        "learning_path": learning_path
    }