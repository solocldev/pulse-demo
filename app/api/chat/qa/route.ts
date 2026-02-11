import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, transcript } = await req.json();

  const systemPrompt = `You are a knowledgeable AI assistant for Ujjivan Small Finance Bank's "Two Wheeler Loan" product.
Your goal is to answer user questions accurately based *only* on the provided product program document.

Here is the "Two Wheeler Loan – Product Program" document for context:
---
# Two Wheeler Loan – Product Program

**Ujjivan Small Finance Bank Ltd.**  
**Version:** V2.0 (Approved & Signed)

---

## 📘 Product Overview

### Q1. What is the purpose of the Two-Wheeler Loan?

**Answer:**  
The Two-Wheeler Loan is offered for the purchase of a new two-wheeler, including petrol, diesel, and electric vehicles from approved manufacturers.

---

### Q2. Which customer segment is primarily targeted?

**Answer:**  
Ujjivan primarily targets the executive and economy segment where two-wheeler prices are below ₹1 lakh, focusing on mass-market customers in semi-urban and rural areas.

---

### Q3. Who are the eligible customer types?

**Answer:**  
Both existing Ujjivan customers and new-to-bank customers are eligible, including salaried and self-employed individuals.

---

## 💰 Loan Features

### Q4. What is the loan amount range?

**Answer:**

- Minimum: ₹26,000
- Maximum: ₹2,75,000
- Non-income proof customers: up to ₹1.75 lakh
- Income-proof customers: up to ₹2.75 lakh

---

### Q5. What loan tenures are available?

**Answer:**  
Loan tenure ranges from 12 to 48 months. Tenures of 42 and 48 months are applicable only if the loan amount exceeds ₹1 lakh.

---

### Q6. What is the interest rate charged?

**Answer:**  
Interest rates range from **17.5% to 23.5% IRR per annum**, calculated on a diminishing balance basis using risk-based pricing.

---

## 🧾 Eligibility Criteria

### Q7. What is the minimum and maximum age eligibility?

**Answer:**

- Minimum age: 21 years
- Applicants aged 18–20 years require a mandatory co-applicant
- Maximum age: 62 years and 11 months at loan maturity

---

### Q8. Is a minimum bureau score required?

**Answer:**  
Yes, a minimum bureau score of **600 or above** is required as per the latest credit policy.

---

### Q9. What employment or business stability is required?

**Answer:**

- Salaried: Minimum 1 year in the current organization
- Self-employed: Minimum 1 year of business experience

---

## 📂 Documentation

### Q10. What documents are required before loan sanction?

**Answer:**

- Application form
- Applicant & co-applicant photographs
- KYC documents
- Cancelled cheque
- Proforma invoice
- Income proof (if applicable)

---

## ⚠️ Charges & Penalties

### Q11. What are the processing and documentation charges?

**Answer:**

- Processing fee: Up to 4% of loan amount + taxes
- Documentation charges: ₹500 + GST
- Stamp duty: As per state law

---

### Q12. What are the bounce and late payment charges?

**Answer:**

- Bounce charge: ₹500 + GST per bounce
- Late payment charge: 2.5% of overdue EMI amount + GST if unpaid beyond 3 days

---

### Q13. Is there a pre-closure penalty?

**Answer:**

- Within 12 months: 2% of principal outstanding + GST
- After 12 months: 1% of principal outstanding + GST

---

## 🔁 Repayment Details

### Q14. How are EMIs repaid?

**Answer:**  
Through Equated Monthly Installments (EMIs) via Standing Instructions or NACH.

---

## 📊 Risk Monitoring

### Q15. What are Early Warning Triggers (EWT)?

**Answer:**

- 30+ DPD > 2%
- GNPA > 0.75%
- NNPA > 0.50%
- RC pending > 60 days > 3%
- Invoice/Insurance pending > 30 days > 2%

---

## 🏍️ Mid-Premium Two-Wheeler – Model Wise LTV

### Q16. What is LTV (Loan to Value)?

**Answer:**  
LTV refers to the percentage of the **on-road price** of the vehicle that can be financed by the bank.  
Example: If LTV is 85%, the bank finances 85% of the on-road price.

---

### Q17. What customer profiles are used for deciding LTV?

**Answer:**

- **ETC** – Existing to Credit customer
- **NTC** – New to Credit customer
- **ETB** – Existing to Bank customer
- **NTB** – New to Bank customer
- **IP** – Income Proof customer
- **NIP / Banking Surrogate** – Non-Income Proof customer

---

### Q18. How is model-specific LTV determined?

**Answer:**  
Model-specific LTV is decided based on:

1. Vehicle make & model
2. Cubic Capacity (CC)
3. Customer profile (IP / Banking Surrogate)
4. Credit profile (ETC / NTC)
5. ABB or bureau score

---

### Q19. Example: What is the LTV for Royal Enfield Continental GT 650?

**Answer:**  
For **Royal Enfield Continental GT 650 cc**:

- Banking Surrogate + ETC: **77% – 85%**
- Banking Surrogate + NTC: **75% – 85%**
- Income Proof + ETC: **73% – 82%**
- Income Proof + NTC: **70% – 80%**

Final LTV depends on ABB or bureau score.

---

### Q20. Are LTVs same for all mid-premium models?

**Answer:**  
No. LTV varies by **model, CC, income profile, and credit history**.  
Examples of covered brands include:

- Royal Enfield (Classic, Bullet, Himalayan, Interceptor, Continental GT)
- Honda (CB350, H’ness, CB300R)
- KTM (Duke, RC, Adventure)
- Yamaha (R15, MT-03, R3)
- Bajaj, TVS, Suzuki, Hero, BMW

---

## 📌 Source Documents

- **Two Wheeler Loan – Product Program (V2.0)**
- **Mid-Premium Model Wise LTV – Two Wheeler**

---

Guidelines:
1. Answer clearly and concisely.
2. If the answer is not in the provided document, politely state that you don't have that information in the current context.
3. Use a professional and helpful tone.
4. If the user asks about something unrelated to the Two Wheeler Loan, guide them back to the topic or mention your scope is limited to this product.`;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
