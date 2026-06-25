package com.easypay;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

/**
 * MainActivity - Main entry point for EasyPay app
 * Hosts the web application in a WebView
 * Handles NFC intents and communicates with backend
 */
public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final String BACKEND_URL = "https://tap-to-pay-app.manus.space";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView
        webView = findViewById(R.id.webView);
        setupWebView();

        // Load the web application
        webView.loadUrl(BACKEND_URL);
    }

    /**
     * Configure WebView settings for optimal performance and security
     */
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);

        // Enable DOM storage
        webSettings.setDomStorageEnabled(true);

        // Enable database storage
        webSettings.setDatabaseEnabled(true);

        // Set user agent for better compatibility
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " EasyPayAndroid/1.0");

        // Enable mixed content (if needed for development)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Cache settings
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Set viewport
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);

        // Enable zoom controls
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);

        // Set WebViewClient to handle page navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle NFC payment intents
                if (url.startsWith("easypay://nfc/")) {
                    handleNFCPayment(url);
                    return true;
                }
                // Load other URLs in WebView
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject NFC bridge when page loads
                injectNFCBridge();
            }
        });

        // Add JavaScript interface for NFC communication
        webView.addJavascriptInterface(new NFCBridge(this), "NFCBridge");
    }

    /**
     * Inject NFC bridge into web page
     */
    private void injectNFCBridge() {
        String bridgeCode = "window.NFCAvailable = true;";
        webView.evaluateJavascript(bridgeCode, null);
    }

    /**
     * Handle NFC payment intent
     */
    private void handleNFCPayment(String url) {
        Intent intent = new Intent(this, NFCPaymentActivity.class);
        intent.setData(android.net.Uri.parse(url));
        startActivity(intent);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // Handle NFC tag discovery
        if (intent.getAction() != null && intent.getAction().equals("android.nfc.action.TAG_DISCOVERED")) {
            Intent nfcIntent = new Intent(this, NFCPaymentActivity.class);
            nfcIntent.putExtras(intent);
            startActivity(nfcIntent);
        }
    }
}
