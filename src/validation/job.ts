import * as yup from "yup"

export  const jobSchema = yup
  .object({
    title: yup.string().required("職名は入力必須です"),
    job_category: yup.string().required(),
    salary_lower: yup.number().required(),
    salary_upper: yup.number().required(),
    work_location: yup.string().required(),
    description: yup.string().required(),
    appeal_points: yup.string().required(),
    desired_candidates: yup.string().required(),
    selection_process: yup.boolean().required(),
    outline: yup.string().required(),
    company_name: yup.string().required(),
    working_hours: yup.string().required(),
    ocr_text: yup.string().required(),
    company_info: yup.string().required(),
    company_id: yup.string().required("企業は入力必須です"),
    job_status_id: yup.string().required(),
    thumbnail: yup.string().required(),
  })
  .required();
