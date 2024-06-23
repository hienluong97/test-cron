import * as yup from "yup"

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export  const companySchema = yup
  .object({
    name: yup.string().required("企業名は入力必須です"),
    website: yup.string().required("サイトは入力必須です"),
    email: yup
      .string()
      .required("サイトは入力必須です")
      .email("メールアドレス形式で入力してください"),
    phone: yup
      .string()
      .required("サイトは入力必須です")
      .matches(phoneRegExp, "電話番号が無効です")
      .min(8, "8文字以上の範囲で入力してください")
      .max(10, "10文字以下の範囲で入力してください"),
    description: yup.string().required("企業の説明は入力必須です"),
    address: yup.string().required("アドレスは入力必須です"),
    thumbnail: yup.string().notRequired(),
    favicon: yup.string().notRequired(),
    img_logo: yup.string().notRequired(),
    img_cover: yup.string().notRequired(),
    is_public: yup.boolean().notRequired(),
    domain_name: yup.string().required("domain_nameは入力必須です"),
    domain_alias: yup.string().required("domain_aliasは入力必須です"),
    ga_tag: yup.string().required("ga_tagは入力必須です"),
    gtm_tag: yup.string().required("gtm_tagは入力必須です"),
    policy: yup.string().required("policyは入力必須です"),
    slug: yup.string().required("slugは入力必須です"),
  })
  .required();
