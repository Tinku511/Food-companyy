import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@sesemefoods.com';

const colors = {
  ivory: '#FAF6EE',
  charcoal: '#1F2B22',
  brass: '#B8860B',
  plum: '#5C2A3A',
};

type OrderItemInfo = {
  productName: string;
  quantity: number;
};

function generateEmailShell(title: string, content: string) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: ${colors.ivory}; padding: 40px 20px; color: ${colors.charcoal};">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: ${colors.brass}; margin: 0; font-size: 28px;">SesemeFoods</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #eaeaea;">
        <h2 style="margin-top: 0; font-size: 20px; color: ${colors.charcoal}; border-bottom: 2px solid ${colors.ivory}; padding-bottom: 15px;">
          ${title}
        </h2>
        ${content}
      </div>
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
        &copy; ${new Date().getFullYear()} SesemeFoods. All rights reserved.
      </div>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(
  orderId: string,
  userEmail: string,
  userName: string,
  totalAmount: number,
  items: OrderItemInfo[],
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Order confirmation email not sent.');
    return;
  }

  const itemsList = items
    .map((item) => `<li><strong>${item.quantity}x</strong> ${item.productName}</li>`)
    .join('');

  const content = `
    <p>Hi ${userName},</p>
    <p>Thank you for your order! We've received your payment and are getting your items ready.</p>
    
    <div style="background-color: ${colors.ivory}; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 0;"><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
    </div>

    <h3 style="color: ${colors.charcoal}; margin-top: 25px;">Items Ordered</h3>
    <ul style="padding-left: 20px;">
      ${itemsList}
    </ul>

    <p style="margin-top: 30px;">You can track your order status anytime by visiting our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?id=${orderId}" style="color: ${colors.brass}; text-decoration: none; font-weight: bold;">Order Tracking Page</a>.</p>
    
    <p style="margin-top: 30px; margin-bottom: 0;">Best,<br>The SesemeFoods Team</p>
  `;

  const html = generateEmailShell('Order Confirmation', content);

  const msg = {
    to: userEmail,
    from: { email: FROM_EMAIL, name: 'SesemeFoods' },
    subject: `Order Confirmation - ${orderId}`,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function sendShippingUpdateEmail(
  orderId: string,
  userEmail: string,
  userName: string,
  newStatus: string,
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Shipping update email not sent.');
    return;
  }

  let statusMessage = '';
  let subject = '';

  if (newStatus === 'SHIPPED') {
    subject = `Your order has shipped! - ${orderId}`;
    statusMessage =
      "Great news! Your order has been packed and handed over to our delivery partners. It's on its way to you.";
  } else if (newStatus === 'DELIVERED') {
    subject = `Your order has been delivered - ${orderId}`;
    statusMessage = 'Your order has been marked as delivered. We hope you enjoy your items!';
  } else {
    // We only care about SHIPPED and DELIVERED for transactional emails based on the prompt.
    return;
  }

  const content = `
    <p>Hi ${userName},</p>
    <p>${statusMessage}</p>
    
    <div style="background-color: ${colors.ivory}; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 0;"><strong>Current Status:</strong> <span style="color: ${colors.brass}; font-weight: bold;">${newStatus}</span></p>
    </div>

    <p style="margin-top: 30px;">Track the latest updates on our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?id=${orderId}" style="color: ${colors.brass}; text-decoration: none; font-weight: bold;">Order Tracking Page</a>.</p>
    
    <p style="margin-top: 30px; margin-bottom: 0;">Best,<br>The SesemeFoods Team</p>
  `;

  const html = generateEmailShell('Shipping Update', content);

  const msg = {
    to: userEmail,
    from: { email: FROM_EMAIL, name: 'SesemeFoods' },
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Shipping update email sent to ${userEmail} (Status: ${newStatus})`);
  } catch (error) {
    console.error('Error sending shipping update email:', error);
  }
}
