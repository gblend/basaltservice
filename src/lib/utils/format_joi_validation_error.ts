export const formatValidationError = ({
  details,
}: {
  details: any[];
}): string[] => {
  return details.map((detail): any => {
    if (detail.message) {
      return detail.message.split('"').join('');
    }
    return detail.message;
  });
};
