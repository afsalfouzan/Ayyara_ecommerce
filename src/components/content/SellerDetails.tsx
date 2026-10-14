import { site } from '@/lib/site';

/** Who sells and who handles complaints, as India's e-commerce rules require on the policy pages. */
export function SellerDetails() {
  const { legal, contact } = site;
  return (
    <ul>
      <li>
        Seller: {legal.tradingName}, a sole proprietorship of {legal.proprietor}
      </li>
      <li>Address: {contact.address}</li>
      <li>
        Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </li>
      <li>
        Phone: <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a> ({contact.hours})
      </li>
    </ul>
  );
}

/** The grievance officer, with the response times India's e-commerce rules set. */
export function GrievanceOfficer() {
  const { legal, contact } = site;
  return (
    <>
      <p>
        If you have a complaint about an order, a product or how we handle your information, contact our grievance officer. We acknowledge every complaint within 48 hours and aim to resolve it within one month.
      </p>
      <ul>
        <li>Grievance officer: {legal.grievanceOfficer}</li>
        <li>
          Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        <li>
          Phone: <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
        </li>
        <li>Address: {contact.address}</li>
      </ul>
    </>
  );
}

export const POLICIES_UPDATED = '14 October 2026';
