const validateInvoice = (req, res, next) => {
    const { supplier, invoice_no, date, material, invoice_total, currency } = req.body;

    if (!supplier || !invoice_no || !date || !material || !currency || isNaN(invoice_total)) {
        return res.status(400).json({ message: 'Missing or invalid fields.' });
    }
    
    next(); // Move to the next function if validation passes
};

module.exports = validateInvoice;