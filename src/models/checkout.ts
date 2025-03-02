export interface ShippingDetails {
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface PaymentDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
}

export interface OrderDetails {
    date: string;
    items: any[];
    shipping: number;
    tax: number;
    total: number;
    customer: string;
    pay_method: string; 
}