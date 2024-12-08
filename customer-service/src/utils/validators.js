exports.validateCIN = (cin) => {
    const cinRegex = /^[A-Za-z0-9]+$/; // Allows only letters and numbers
    return cinRegex.test(cin);
  };