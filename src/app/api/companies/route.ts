import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@utility/supabase-client";


// app/api/companies

// get list companies
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseClient.from("companies").select("*");

    if (error) {
      console.error("Error fetching companies data", error);
      return NextResponse.json(
        { error: "Error fetching companies data" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching companies data", error);
    return NextResponse.json(
      { error: "Error fetching companies data" },
      { status: 500 },
    );
  }
}


// create a company
export async function POST(request: NextRequest) {
  const companyData = await request.json();
 const {
   name,
   website,
   email,
   phone,
   description,
   address,
   thumbnail,
   favicon,
   is_public,
   domain_name,
   ga_tag,
   gtm_tag,
   img_logo,
   img_cover,
   domain_alias,
   policy,
   slug,
 } = companyData;
  try {
    const { data, error } = await supabaseClient
      .from("companies")
      .insert({
        name,
        website,
        email,
        phone,
        description,
        address,
        thumbnail,
        favicon,
        is_public,
        domain_name,
        ga_tag,
        gtm_tag,
        img_logo,
        img_cover,
        domain_alias,
        policy,
        slug,
      })
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


