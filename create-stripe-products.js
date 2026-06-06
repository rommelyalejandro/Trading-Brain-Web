const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...key...');

async function createProducts() {
  console.log("Creando productos en Stripe...");

  const plans = [
    { name: "Gold", price: 999 }, // $9.99
    { name: "Platinum", price: 1999 }, // $19.99
    { name: "Paladium AI", price: 4999 } // $49.99
  ];

  for (const plan of plans) {
    try {
      // Create Product
      const product = await stripe.products.create({
        name: plan.name,
        description: `Suscripción mensual al Ecosistema Bright-Brain - Plan ${plan.name}`
      });

      // Create Price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: 'usd',
        recurring: { interval: 'month' },
      });

      console.log(`Plan: ${plan.name} -> Price ID: ${price.id}`);
    } catch (e) {
      console.error(`Error creando ${plan.name}:`, e.message);
    }
  }
}

createProducts();
