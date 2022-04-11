"""init file."""
from job.models.jobs import Job
from job.models.job_bookmark import JobBookmark
from job.models.job_applications import JobApplication
from job.models.job_qualifications import JobQualification
from job.models.match_score import MatchScore
from job.models.email_templates import EmailTemplate
from job.models.job_alerts import JobAlert
from job.models.job_company import JobCompany
from job.models.job_industry import Industry
from job.models.job_category import Category, JobCategoryWeight
from job.models.job_templates import JobTemplate
from job.models.job_status import JobStatus
from job.models.user_job_match import UserJobMatch

from job.models.job_skills import JobSkill
from job.models.job_survey import SurveyFeedBack
