const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
let stripeKey = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('STRIPE_SECRET_KEY=')) {
    stripeKey = line.split('=')[1].trim();
  }
});

const Stripe = require('stripe');
const stripe = new Stripe(stripeKey);

async function setup() {
  console.log("Configurando productos de Stripe...");
  try {
    const freeProduct = await stripe.products.create({ name: "Licencia Free (Por vida)" });
    const freePrice = await stripe.prices.create({
      product: freeProduct.id,
      unit_amount: 199, 
      currency: 'usd',
    });
    console.log(`Free Plan -> Price ID: ${freePrice.id}`);

    const goldProduct = await stripe.products.create({ name: "Gold Plan" });
    const goldPrice = await stripe.prices.create({
      product: goldProduct.id,
      unit_amount: 399,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Gold Plan -> Price ID: ${goldPrice.id}`);

    const platProduct = await stripe.products.create({ name: "Platinum Plan" });
    const platPrice = await stripe.prices.create({
      product: platProduct.id,
      unit_amount: 999,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Platinum Plan -> Price ID: ${platPrice.id}`);

    const pallProduct = await stripe.products.create({ name: "Palladium AI Plan" });
    const pallPrice = await stripe.prices.create({
      product: pallProduct.id,
      unit_amount: 1999,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Palladium AI Plan -> Price ID: ${pallPrice.id}`);

  } catch (error) {
    console.error("Error setting up Stripe:", error.message);
  }
}

setup();
