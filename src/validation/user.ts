import * as yup from 'yup';

const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const createUserSchema = yup
  .object({
    name: yup.string().required("名は入力必須です"),
    email: yup
      .string()
      .required("メールアドレスは入力必須です")
      .matches(emailRegExp, "無効メールです"),
    password: yup.string().required("パスワードは入力必須です"),
    user_type_id: yup.string().notRequired(),
  })
  .required();


  export const editUserSchema = yup
    .object({
      first_name: yup.string().required("名は入力必須です"),
      last_name: yup.string().required("姓は入力必須です"),
      first_kana: yup.string().required("名（カナ）は入力必須です"),
      last_kana: yup.string().required("姓（カナ）は入力必須です"),
      gender: yup.string().notRequired(),
      birthday: yup.string().notRequired(),
      postal_code: yup.string().notRequired(),
      phone: yup.string().notRequired(),
      introduction: yup.string().required("自己紹介は入力必須です"),
      address: yup.string().notRequired(),
      self_promotion: yup.string().notRequired(),
      qualifications: yup.string().notRequired(),
      languages: yup.string().notRequired(),
      business_types: yup.string().notRequired(),
      app_frameworks: yup.string().notRequired(),
      databases: yup.string().notRequired(),
      platforms: yup.string().notRequired(),
      other_qualifications: yup.string().notRequired(),
      name: yup.string().notRequired(),
      faculty: yup.string().notRequired(),
      major: yup.string().notRequired(),
      graduation_year: yup.number().notRequired(),
      pr_relationship: yup.string().notRequired(),
      pr_adaptation: yup.string().notRequired(),
      //   email_opt_in: yup.boolean().notRequired(),
      //   is_demo_user: yup.boolean().notRequired(),
    })
    .required();