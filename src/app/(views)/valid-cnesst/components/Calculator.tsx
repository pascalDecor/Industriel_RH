import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import CalculatorResults from './CalculatorResults';
import Tooltip from './Tooltip';
import { calculateMortgage } from './utils/mortgageCalculator';
import { HelpCircleIcon } from 'lucide-react';

const MorgageCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    purchasePrice: '',
    downPayment: '',
    interestRate: '',
    amortization: '25',
    paymentFrequency: 'monthly'
  });

  const [results, setResults] = useState<{
    biWeekly: number;
    monthly: number;
    annual: number;
    valid: boolean;
  }>({
    biWeekly: 0,
    monthly: 0,
    annual: 0,
    valid: false
  });

  const [errors, setErrors] = useState<{
    purchasePrice?: string;
    downPayment?: string;
    interestRate?: string;
  }>({});

  type ErrorField = keyof typeof formData;

  const handleInputChange = (name: ErrorField, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific error when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors: {
      purchasePrice?: string;
      downPayment?: string;
      interestRate?: string;
    } = {};

    if (!formData.purchasePrice) {
      newErrors.purchasePrice = "Purchase price is required";
    } else if (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = "Please enter a valid price";
    }

    if (!formData.downPayment) {
      newErrors.downPayment = "Down payment is required";
    } else if (isNaN(Number(formData.downPayment)) || Number(formData.downPayment) < 0) {
      newErrors.downPayment = "Please enter a valid amount";
    } else if (Number(formData.downPayment) >= Number(formData.purchasePrice)) {
      newErrors.downPayment = "Must be less than purchase price";
    }

    if (!formData.interestRate) {
      newErrors.interestRate = "Interest rate is required";
    } else if (isNaN(Number(formData.interestRate)) || Number(formData.interestRate) <= 0 || Number(formData.interestRate) > 20) {
      newErrors.interestRate = "Please enter a valid rate (0-20%)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (validateForm()) {
      const calculationResults = calculateMortgage(
        Number(formData.purchasePrice),
        Number(formData.downPayment),
        Number(formData.interestRate),
        Number(formData.amortization),
        formData.paymentFrequency
      );

      setResults({
        biWeekly: calculationResults.biWeekly,
        monthly: calculationResults.monthly,
        annual: calculationResults.annual,
        valid: true
      });
    }
  };

  const handleClear = () => {
    setFormData({
      purchasePrice: '',
      downPayment: '',
      interestRate: '',
      amortization: '25',
      paymentFrequency: 'monthly'
    });
    setResults({
      biWeekly: 0,
      monthly: 0,
      annual: 0,
      valid: false
    });
    setErrors({});
  };

  const amortizationOptions = [
    { value: '5', label: '5 years' },
    { value: '10', label: '10 years' },
    { value: '15', label: '15 years' },
    { value: '20', label: '20 years' },
    { value: '25', label: '25 years' },
    { value: '30', label: '30 years' }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biWeekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6 text-center">
          Mortgage Payment Calculator
        </h2>

        <div className="space-y-5">
          <InputField
            label="Purchase Price"
            id="purchasePrice"
            placeholder="Enter purchase price"
            value={formData.purchasePrice}
            onChange={(value) => handleInputChange('purchasePrice', value)}
            type="number"
            min="0"
            error={errors.purchasePrice}
            prefix="$"
          />

          <InputField
            label="Down Payment"
            id="downPayment"
            placeholder="Enter down payment"
            value={formData.downPayment}
            onChange={(value) => handleInputChange('downPayment', value)}
            type="number"
            min="0"
            error={errors.downPayment}
            prefix="$"
          />

          <div className="relative">
            <InputField
              label="Interest Rate"
              id="interestRate"
              placeholder="Enter interest rate"
              value={formData.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              type="number"
              min="0"
              max="20"
              step="0.01"
              error={errors.interestRate}
              suffix="%"
              tooltip={
                <Tooltip content="The annual interest rate for your mortgage loan." />
              }
            />
          </div>

          <div className="relative">
            <SelectField
              label="Amortization"
              id="amortization"
              value={formData.amortization}
              onChange={(value) => handleInputChange('amortization', value)}
              options={amortizationOptions}
              tooltip={
                <Tooltip content="The total length of time it will take to pay off your mortgage in full." />
              }
            />
          </div>

          <SelectField
            label="Payment Frequency"
            id="paymentFrequency"
            value={formData.paymentFrequency}
            onChange={(value) => handleInputChange('paymentFrequency', value)}
            options={frequencyOptions}
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              Calculate
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <CalculatorResults results={results} />
    </div>
  );
};

export default MorgageCalculator;