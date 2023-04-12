import axios from 'axios';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
// @ts-nocheck

export const triggerGuestbookPipelineAction = () => {
  return createTemplateAction({
    id: 'ibm:trigger-guestbook-deploy-pipeline',
    description:
      'Custom action to trigger deployment of guestbook application',
    schema: {
      input: z.object({
        clusterName: z
          .string()
          .describe('Name of cluster to deploy application to.'),
        gitRepo: z.
            string().
            describe('Repository housing the Guestbook applications.'),
      }) as z.ZodType,
    },

    async handler(ctx) {
      try {
        ctx.logger.info('Calling cluster deploy pipeline');

        // TODO: update endpoint
        const pipelineEndpoint =
          'http://guestbook-deploy-tekton.itzroks-666000qmn3-85z15f-6ccd7f378ae819553d37d5f2ee142bd6-0000.au-syd.containers.appdomain.cloud/';

        const data = {
          clusterName: ctx.input.clusterName,
          gitRepo: ctx.input.gitRepo,
        };

        const response = await axios.post(
          pipelineEndpoint,
          JSON.stringify(data),
        );

        if (response.status === 202) {
          ctx.logger.info(`Pipeline build started successfully.`);
        } else {
          ctx.logger.info(
            `Pipeline build could not be triggered. Check if the tasks are being referenced properly`,
          );
        }
      } catch (err) {
        ctx.logger.error('Failed to run Cluster Deploy pipeline: ');
        ctx.logger.error(err.message);
      }
    },
  });
};
