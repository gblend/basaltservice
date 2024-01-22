import emailHelpers from '../../src/lib/utils/email/sendEmail';
import { generateToken } from '../../src/lib/utils';

describe('SendEmail', () => {
  interface ITestEmailPayload {
    name: string;
    email: string;
    verificationToken?: string;
    passwordToken?: string;
  }

  it('should send verification email to the user', async () => {
    const verificationEmail = jest.spyOn(emailHelpers, 'sendVerificationEmail');
    const mockVerificationEmail = async ({
      name,
      email,
      verificationToken: token,
    }: ITestEmailPayload) =>
      jest
        .fn()
        .mockReturnValue(
          await emailHelpers.sendVerificationEmail({
            name,
            email,
            verificationToken: token,
          }),
        );

    const _name = 'Test User';
    const _email = 'test@example.com';
    const _token = generateToken();
    emailHelpers.sendVerificationEmail.mockImplementation(
      () => 'Verification email sent successfully.',
    );
    await mockVerificationEmail({
      name: _name,
      email: _email,
      verificationToken: _token,
    }).catch((_) => _);

    expect(verificationEmail).toHaveBeenCalledTimes(1);
    expect(verificationEmail).toHaveBeenCalledWith({
      name: _name,
      email: _email,
      verificationToken: _token,
    });
  });
});
