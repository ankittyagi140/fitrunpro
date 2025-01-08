package com.fitrunpro;

import android.content.Context;
import com.facebook.flipper.android.AndroidFlipperClient;
import com.facebook.flipper.android.utils.FlipperUtils;
import com.facebook.flipper.core.FlipperClient;
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;

public class ReactNativeFlipper {
    public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
        if (FlipperUtils.shouldEnableFlipper(context)) {
            final FlipperClient client = AndroidFlipperClient.getInstance(context);
            client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));
            final NetworkFlipperPlugin networkFlipperPlugin = new NetworkFlipperPlugin();
            client.addPlugin(networkFlipperPlugin);
            
            client.start();

            // Fresco Plugin needs to ensure that ImagePipelineFactory is initialized
            // Hence we run if after all native modules have been initialized
            ReactInstanceEventListener reactInstanceEventListener = new ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext reactContext) {
                    // Remove NetworkingModule reference
                }
            };
            reactInstanceManager.addReactInstanceEventListener(reactInstanceEventListener);
        }
    }
} 