import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@utility/supabase-client";


// app/api/companies

// get list companies
// export async function GET(request: NextRequest) {
//     if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
//         return NextResponse.json(
//             { error: "Unauthorized" },
//             { status: 401 },
//           );
//       }

//   try {
//     const { data, error } = await supabaseClient.from("matchings").select("*");

//     if (error) {
//       console.error("Error fetching companies data", error);
//       return NextResponse.json(
//         { error: "Error fetching companies data" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching companies data", error);
//     return NextResponse.json(
//       { error: "Error fetching companies data" },
//       { status: 500 },
//     );
//   }
// }

// create a company
export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
          );
      }

    // const matchingData = await request.json();
   const  matchingData = {
    job_id: 20,
    user_id: "78e77379-75b3-4c74-98db-a3cee92b888c",
    score: 0.98
   } 
    try {
      const { data, error } = await supabaseClient
        .from("matchings")
        .insert(matchingData)
        .select()
        .single();
  
      if (error) {
        console.error("Error creating company", error);
        return NextResponse.json(
          { error: "Error creating company" },
          { status: 500 },
        );
      }
  
      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error("Error creating company", error);
      return NextResponse.json(
        { error: "Error creating company" },
        { status: 500 },
      );
    }
  }
  

