const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            .success {
                color: #22c55e;
                font-size: 48px;
                margin-bottom: 20px;
            }
            h1 {
                color: #1f2937;
                margin-bottom: 10px;
            }
            p {
                color: #6b7280;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="success">✓</div>
            <h1>Payment has been completed successfully.</h1>
            <p>Thank you for your payment.</p>
        </div>
    </body>
    </html>
`

export default html