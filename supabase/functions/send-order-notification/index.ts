import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { order, adminEmail } = body;

    if (!order) {
      return new Response(JSON.stringify({ error: "Missing order data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipient = adminEmail || "isamirkhan5616@gmail.com";

    const orderDate = order.created_at
      ? new Date(order.created_at).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

    const orderIdShort = order.id ? String(order.id).slice(0, 8) : "N/A";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f8fc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10233f 0%, #084298 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffc107; margin: 0; font-size: 24px;">New Order Received</h1>
          <p style="color: rgba(255,255,255,.7); margin: 8px 0 0 0; font-size: 14px;">Marwat Gas Agency — Admin Notification</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #dce5f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold; width: 40%;">Order ID</td>
              <td style="padding: 8px 0; color: #10233f; font-weight: bold;">#${orderIdShort}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Customer Name</td>
              <td style="padding: 8px 0; color: #10233f;">${order.full_name || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Email</td>
              <td style="padding: 8px 0; color: #10233f;">${order.email || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Phone</td>
              <td style="padding: 8px 0; color: #10233f;">${order.phone_number || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Cylinder Type</td>
              <td style="padding: 8px 0; color: #10233f;">${order.cylinder_type || "—"} ${order.cylinder_size || ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Quantity</td>
              <td style="padding: 8px 0; color: #10233f;">${order.quantity || 1}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Unit Price</td>
              <td style="padding: 8px 0; color: #10233f;">Rs. ${Number(order.unit_price || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Total Price</td>
              <td style="padding: 8px 0; color: #0d6efd; font-weight: bold; font-size: 16px;">Rs. ${Number(order.total_price || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Payment Method</td>
              <td style="padding: 8px 0; color: #10233f;">${order.payment_method || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Delivery Address</td>
              <td style="padding: 8px 0; color: #10233f;">${order.street_address || "—"}${order.landmark ? ", Landmark: " + order.landmark : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Time Slot</td>
              <td style="padding: 8px 0; color: #10233f;">${order.delivery_time_slot || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Order Date</td>
              <td style="padding: 8px 0; color: #10233f;">${orderDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">Current Status</td>
              <td style="padding: 8px 0;">
                <span style="background: rgba(255,193,7,.15); color: #e5aa00; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${order.status || "Pending"}</span>
              </td>
            </tr>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${supabaseUrl.replace(".supabase.co", "") === supabaseUrl ? supabaseUrl : ""}/admin" style="background: #0d6efd; color: #ffffff; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">View Order in Admin Panel</a>
          </div>

          <p style="color: #6c757d; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated notification from Marwat Gas Agency ordering system.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        to: recipient,
        subject: `New Order #${orderIdShort} — ${order.full_name || "Customer"}`,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Email send failed:", await emailResponse.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in send-order-notification:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
