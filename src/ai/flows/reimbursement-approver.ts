// reimbursement-approver.ts
'use server';

/**
 * @fileOverview An automatic reimbursement approval AI agent.
 *
 * - automaticReimbursementApproval - A function that handles the reimbursement approval process.
 * - AutomaticReimbursementApprovalInput - The input type for the automaticReimbursementApproval function.
 * - AutomaticReimbursementApprovalOutput - The return type for the automaticReimbursementApproval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticReimbursementApprovalInputSchema = z.object({
  logoutTime: z.string().describe('The logout time of the employee in HH:mm format.'),
  transportMode: z.string().describe('The mode of transport used by the employee.'),
  reason: z.string().describe('The reason for the reimbursement request.'),
  amount: z.number().describe('The amount requested for reimbursement.'),
});
export type AutomaticReimbursementApprovalInput = z.infer<
  typeof AutomaticReimbursementApprovalInputSchema
>;

const AutomaticReimbursementApprovalOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether the reimbursement request is approved or not.'),
  reasoning: z.string().describe('The reasoning behind the approval or rejection.'),
});
export type AutomaticReimbursementApprovalOutput = z.infer<
  typeof AutomaticReimbursementApprovalOutputSchema
>;

export async function automaticReimbursementApproval(
  input: AutomaticReimbursementApprovalInput
): Promise<AutomaticReimbursementApprovalOutput> {
  return automaticReimbursementApprovalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticReimbursementApprovalPrompt',
  input: {schema: AutomaticReimbursementApprovalInputSchema},
  output: {schema: AutomaticReimbursementApprovalOutputSchema},
  prompt: `You are an HR policy expert. You will evaluate the reimbursement request based on the following information:

Logout Time: {{{logoutTime}}}
Transport Mode: {{{transportMode}}}
Reason: {{{reason}}}
Amount: {{{amount}}}

Company Policy: Employees are eligible for transport reimbursement only if they log out after 11:00 PM. Consider the transport mode and reason provided. If the logout time is after 11:00 PM, transport mode is reasonable, and reason is valid, approve the reimbursement. Otherwise, reject it.

Output your reasoning, and whether the reimbursement is approved or not. Ensure that the isApproved field is set to true if approved, and false if rejected. The reasoning field should clearly explain the decision.
`,
});

const automaticReimbursementApprovalFlow = ai.defineFlow(
  {
    name: 'automaticReimbursementApprovalFlow',
    inputSchema: AutomaticReimbursementApprovalInputSchema,
    outputSchema: AutomaticReimbursementApprovalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
