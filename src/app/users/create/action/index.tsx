"use server";

import {
    supabaseAdmin
} from "@utility/supabase-client";
import { revalidatePath, unstable_noStore } from "next/cache";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document';
import { createClient } from '@supabase/supabase-js';

export async function createMember(params: {
    name: string;
    email: string;
    password: string;
    user_type_id: string;
}) {

    const { name, email, password, user_type_id } = params;
    try {
        const result = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name },
        });

        const { data: userData, error } = JSON.parse(JSON.stringify(result));

        if (error) {
            return {
                success: false,
                error,
            };
        }

        if (userData) {
            const { data, error } = await supabaseAdmin
              .from("users")
              .insert({
                id: userData.user?.id,
                email: userData.user?.email,
                first_name: name,
                user_type_id,
              })
              .select();

            if (!error) {
                const { error: insertSkillsError } = await supabaseAdmin.from("skills").insert({
                    self_promotion: "",
                    qualifications: "",
                    platforms: "",
                    other_qualifications: "",
                    languages: "",
                    databases: "",
                    business_types: "",
                    app_frameworks: "",
                    user_id: userData.user?.id,
                });

                if (!insertSkillsError) {
                    const { error: insertEducationsError } = await supabaseAdmin
                        .from("educations")
                        .insert({
                            name: "",
                            faculty: "",
                            major: "",
                            graduation_year: null,
                            user_id: userData.user?.id,
                        });

                    if (!insertEducationsError) {
                        return {
                            success: true,
                            successNotification: {
                                message: "アカウント作成に成功しました。",
                            },
                        };
                    } else {
                        return {
                            success: false,
                            error: JSON.parse(JSON.stringify(insertEducationsError)),
                        };
                    }
                } else {
                    return {
                      success: false,
                      error: JSON.parse(JSON.stringify(insertSkillsError)),
                    };
                }
            }
        }
    } catch (error: any) {
        return {
            success: false,
            error: JSON.parse(JSON.stringify(error)),
        };
    }

    return {
        success: false,
        error: {
            message: "アカウント作成に失敗しました。",
            name: "failed",
        },
    };
}





// export async function updateMemberBasicById(
//   id: string,
//   data: {
//     name: string;
//   }
// ) {
//   const supabase = await createSupbaseServerClient();

//   const result = await supabase.from("member").update(data).eq("id", id);
//   revalidatePath("/dashboard/member");
//   return JSON.stringify(result);
// }

// export async function updateMemberAdvanceById(
//   permission_id: string,
//   user_id: string,
//   data: {
//     role: "admin" | "user";
//     status: "active" | "resigned";
//   }
// ) {
//   const { data: userSession } = await readUserSession();
//   if (userSession.session?.user.user_metadata.role !== "admin") {
//     return JSON.stringify({
//       error: { message: "You are not allowed to do this!" },
//     });
//   }

//   const supabaseAdmin = await createSupbaseAdmin();

//   const updateResult = await supabaseAdmin.auth.admin.updateUserById(user_id, {
//     user_metadata: { role: data.role },
//   });
//   if (updateResult.error?.message) {
//     return JSON.stringify(updateResult);
//   } else {
//     const supabase = await createSupbaseServerClient();
//     const result = await supabase
//       .from("permission")
//       .update(data)
//       .eq("id", permission_id);
//     revalidatePath("/dashboard/member");
//     return JSON.stringify(result);
//   }
// }

// export async function updateMemberAcccountById(
//   user_id: string,
//   data: {
//     email: string;
//     password?: string | undefined;
//     confirm?: string | undefined;
//   }
// ) {
//   const { data: userSession } = await readUserSession();
//   if (userSession.session?.user.user_metadata.role !== "admin") {
//     return JSON.stringify({
//       error: { message: "You are not allowed to do this!" },
//     });
//   }

//   let updateObject: {
//     email: string;
//     password?: string | undefined;
//   } = { email: data.email };

//   if (data.password) {
//     updateObject["password"] = data.password;
//   }

//   const supabaseAdmin = await createSupbaseAdmin();

//   const updateResult = await supabaseAdmin.auth.admin.updateUserById(
//     user_id,
//     updateObject
//   );

//   if (updateResult.error?.message) {
//     return JSON.stringify(updateResult);
//   } else {
//     const supbase = await createSupbaseServerClient();
//     const result = await supbase
//       .from("member")
//       .update({ email: data.email })
//       .eq("id", user_id);
//     revalidatePath("/dashboard/member");
//     return JSON.stringify(result);
//   }
// }

// export async function deleteMemberById(user_id: string) {
//   const { data: userSession } = await readUserSession();
//   if (userSession.session?.user.user_metadata.role !== "admin") {
//     return JSON.stringify({
//       error: { message: "You are not allowed to do this!" },
//     });
//   }
//   const supabaseAdmin = await createSupbaseAdmin();
//   const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id);

//   if (deleteResult.error?.message) {
//     return JSON.stringify(deleteResult);
//   } else {
//     const supbase = await createSupbaseServerClient();
//     const result = await supbase.from("member").delete().eq("id", user_id);
//     revalidatePath("/dashboard/member");
//     return JSON.stringify(result);
//   }
// }

// export async function readMembers() {
//   unstable_noStore();
//   const supbase = await createSupbaseServerClient();
//   return await supbase.from("permission").select("*,member(*)");
// }
