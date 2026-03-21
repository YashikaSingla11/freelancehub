"""
AI Screening Engine — FreelanceHub
Automatically scores freelancer applications and decides approve/reject
"""

# In-demand skills database with category weights
SKILL_CATEGORIES = {
    'frontend': {
        'keywords': ['react', 'vue', 'angular', 'javascript', 'typescript',
                     'html', 'css', 'tailwind', 'next.js', 'redux'],
        'weight': 1.2
    },
    'backend': {
        'keywords': ['python', 'django', 'flask', 'node.js', 'express',
                     'java', 'spring', 'php', 'laravel', 'fastapi', 'go'],
        'weight': 1.3
    },
    'database': {
        'keywords': ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite',
                     'firebase', 'dynamodb'],
        'weight': 1.1
    },
    'devops': {
        'keywords': ['docker', 'kubernetes', 'aws', 'gcp', 'azure',
                     'ci/cd', 'linux', 'terraform'],
        'weight': 1.4
    },
    'mobile': {
        'keywords': ['react native', 'flutter', 'swift', 'kotlin',
                     'android', 'ios'],
        'weight': 1.2
    },
    'data_ml': {
        'keywords': ['machine learning', 'deep learning', 'tensorflow',
                     'pytorch', 'pandas', 'numpy', 'scikit-learn',
                     'nlp', 'computer vision', 'data analysis', 'openai'],
        'weight': 1.5
    },
    'design': {
        'keywords': ['figma', 'sketch', 'adobe xd', 'photoshop',
                     'illustrator', 'ui/ux', 'wireframing'],
        'weight': 1.1
    },
}

# Experience scoring table
EXPERIENCE_SCORE = {0: 0.3, 1: 0.5, 2: 0.65, 3: 0.75,
                    4: 0.82, 5: 0.88, 7: 0.93, 10: 1.0}

MIN_SCORE_TO_APPROVE = 0.55
MIN_SKILLS_REQUIRED = 3
MIN_EXPERIENCE = 1


def score_skills(skills_text):
    skills_lower = skills_text.lower()
    matched = []
    total = 0.0
    categories_matched = 0

    for cat, data in SKILL_CATEGORIES.items():
        cat_matches = [kw for kw in data['keywords'] if kw in skills_lower]
        if cat_matches:
            matched.extend(cat_matches)
            score = len(cat_matches) * data['weight']
            if len(cat_matches) >= 3:
                score *= 1.15  # depth bonus
            total += score
            categories_matched += 1

    # breadth bonus
    if categories_matched >= 2:
        total *= 1.1
    if categories_matched >= 3:
        total *= 1.05

    return min(total / 15.0, 1.0), matched


def score_experience(years):
    for threshold in sorted(EXPERIENCE_SCORE.keys(), reverse=True):
        if years >= threshold:
            return EXPERIENCE_SCORE[threshold]
    return 0.2


def score_completeness(application):
    score = 0.0
    if application.bio and len(application.bio) > 50:
        score += 0.3
    if application.portfolio_url:
        score += 0.3
    if application.resume:
        score += 0.25
    if application.hourly_rate:
        score += 0.15
    return score


def screen_application(application):
    """
    Main function — call this after saving a FreelancerProfile.
    Returns: (score: float, feedback: str, should_approve: bool)
    """
    skills_score, matched_skills = score_skills(application.skills)
    exp_score = score_experience(application.experience)
    completeness = score_completeness(application)

    # Weighted total
    final_score = (skills_score * 0.45) + (exp_score * 0.35) + (completeness * 0.20)

    # Hard rejection checks
    rejection_reasons = []
    skill_count = len(application.get_skills_list())

    if skill_count < MIN_SKILLS_REQUIRED:
        rejection_reasons.append(
            f"minimum {MIN_SKILLS_REQUIRED} skills required (you listed {skill_count})"
        )
    if application.experience < MIN_EXPERIENCE:
        rejection_reasons.append(
            f"minimum {MIN_EXPERIENCE} year experience required"
        )
    if not matched_skills:
        rejection_reasons.append(
            "no recognized in-demand technologies found in your skills"
        )

    should_approve = (final_score >= MIN_SCORE_TO_APPROVE) and (len(rejection_reasons) == 0)
    feedback = _build_feedback(final_score, matched_skills, application.experience,
                                completeness, rejection_reasons, should_approve)

    return round(final_score, 3), feedback, should_approve


def _build_feedback(score, matched_skills, experience, completeness,
                     rejection_reasons, approved):
    lines = []
    score_pct = int(score * 100)

    if approved:
        lines.append(f"AI Score: {score_pct}/100 — Your profile meets our standards!")
        if matched_skills:
            lines.append(f"Strong skills detected: {', '.join(matched_skills[:6])}.")
        if experience >= 5:
            lines.append("Excellent experience level.")
        elif experience >= 3:
            lines.append("Good experience level.")
        if completeness >= 0.7:
            lines.append("Well-completed profile.")
    else:
        lines.append(f"AI Score: {score_pct}/100 — Profile needs improvement.")
        if rejection_reasons:
            lines.append("Issues: " + "; ".join(rejection_reasons) + ".")

        suggestions = []
        if score < 0.4:
            suggestions.append("add more in-demand technologies (React, Python, AWS, etc.)")
        if experience < 2:
            suggestions.append("gain more hands-on experience (projects, internships)")
        if completeness < 0.5:
            suggestions.append("complete your profile — add bio, portfolio URL, and resume")
        if not matched_skills:
            suggestions.append("mention specific technologies instead of general terms")

        if suggestions:
            lines.append("To improve: " + "; ".join(suggestions) + ".")

    return " ".join(lines)