package com.easypay;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * NFCBridge - JavaScript interface for NFC communication
 * Allows web app to communicate with native NFC functionality
 */
public class NFCBridge {

    private Context context;

    public NFCBridge(Context context) {
        this.context = context;
    }

    /**
     * Check if NFC is available on device
     */
    @JavascriptInterface
    public boolean isNFCAvailable() {
        return context.getPackageManager().hasSystemFeature("android.hardware.nfc");
    }

    /**
     * Start NFC payment process
     */
    @JavascriptInterface
    public void startNFCPayment(String amount, String description, String accountId) {
        android.content.Intent intent = new android.content.Intent(context, NFCPaymentActivity.class);
        intent.putExtra("amount", amount);
        intent.putExtra("description", description);
        intent.putExtra("accountId", accountId);
        context.startActivity(intent);
    }

    /**
     * Log message from web app
     */
    @JavascriptInterface
    public void log(String message) {
        android.util.Log.d("EasyPay", message);
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    /**
     * Handle payment completion
     */
    @JavascriptInterface
    public void onPaymentComplete(String transactionId, String status) {
        android.util.Log.d("EasyPay", "Payment completed: " + transactionId + " - " + status);
    }

    /**
     * Handle payment error
     */
    @JavascriptInterface
    public void onPaymentError(String error) {
        android.util.Log.e("EasyPay", "Payment error: " + error);
        Toast.makeText(context, "Payment Error: " + error, Toast.LENGTH_LONG).show();
    }
}
