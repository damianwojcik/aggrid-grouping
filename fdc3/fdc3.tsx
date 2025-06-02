import { useEffect, useState } from 'react';
import type { FDC3Context } from '@finos/fdc3';

type Params<TContext> = {
  contextType: string;
  intentName: string;
  fdc3: typeof import('@finos/fdc3');
};

type Result<TContext> = {
  context?: FDC3Context;
};

export const useFDC3 = <TContext>({ contextType, intentName, fdc3 }: Params<TContext>): Result<TContext> => {
  const [context, setContext] = useState<FDC3Context | undefined>(undefined);

  useEffect(() => {
    const setupFDC3 = async () => {
      try {
        // Join a default context group if not already in one
        const currentChannel = await fdc3.getCurrentChannel();

        if (!currentChannel) {
          const systemChannels = await fdc3.getSystemChannels();
          const defaultChannel = systemChannels.find(ch => ch.id === 'blue'); // or 'green', 'red'...

          if (defaultChannel) {
            await fdc3.joinContextGroup(defaultChannel.id);
            console.log(`Joined default channel: ${defaultChannel.id}`);
          } else {
            console.warn('No default system channel found.');
          }
        }

        // Register listeners
        await fdc3.addIntentListener(intentName, setContext);
        await fdc3.addContextListener(contextType, setContext);
      } catch (err) {
        console.error('Error setting up FDC3:', err);
      }
    };

    if (fdc3) {
      setupFDC3();
    }
  }, [contextType, intentName, fdc3]);

  if (!fdc3) return {};

  return { context };
};
