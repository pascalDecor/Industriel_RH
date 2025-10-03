"use client";

import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import CalculatorResults from './CalculatorResults';
import Tooltip from './Tooltip';
import { calculateMortgage } from './utils/mortgageCalculator';
import { useTranslation } from '@/contexts/LanguageContext';

const MorgageCalculator: React.FC = () => {
  const { t } = useTranslation();
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
      newErrors.purchasePrice = t('mortgage_calculator.calculator.purchase_price_required');
    } else if (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = t('mortgage_calculator.calculator.valid_price');
    }

    if (!formData.downPayment) {
      newErrors.downPayment = t('mortgage_calculator.calculator.down_payment_required');
    } else if (isNaN(Number(formData.downPayment)) || Number(formData.downPayment) < 0) {
      newErrors.downPayment = t('mortgage_calculator.calculator.valid_amount');
    } else if (Number(formData.downPayment) >= Number(formData.purchasePrice)) {
      newErrors.downPayment = t('mortgage_calculator.calculator.less_than_purchase');
    }

    if (!formData.interestRate) {
      newErrors.interestRate = t('mortgage_calculator.calculator.interest_rate_required');
    } else if (isNaN(Number(formData.interestRate)) || Number(formData.interestRate) <= 0 || Number(formData.interestRate) > 20) {
      newErrors.interestRate = t('mortgage_calculator.calculator.valid_rate');
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
    { value: '5', label: t('mortgage_calculator.calculator.5_years') },
    { value: '10', label: t('mortgage_calculator.calculator.10_years') },
    { value: '15', label: t('mortgage_calculator.calculator.15_years') },
    { value: '20', label: t('mortgage_calculator.calculator.20_years') },
    { value: '25', label: t('mortgage_calculator.calculator.25_years') },
    { value: '30', label: t('mortgage_calculator.calculator.30_years') }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: t('mortgage_calculator.calculator.weekly') },
    { value: 'biWeekly', label: t('mortgage_calculator.calculator.bi_weekly') },
    { value: 'monthly', label: t('mortgage_calculator.calculator.monthly') }
  ];

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6 text-center">
          {t('mortgage_calculator.calculator.title')}
        </h2>

        <div className="space-y-5">
          <InputField
            label={t('mortgage_calculator.calculator.purchase_price')}
            id="purchasePrice"
            placeholder={t('mortgage_calculator.calculator.enter_purchase_price')}
            value={formData.purchasePrice}
            onChange={(value) => handleInputChange('purchasePrice', value)}
            type="number"
            min="0"
            error={errors.purchasePrice}
            prefix="$"
          />

          <InputField
            label={t('mortgage_calculator.calculator.down_payment')}
            id="downPayment"
            placeholder={t('mortgage_calculator.calculator.enter_down_payment')}
            value={formData.downPayment}
            onChange={(value) => handleInputChange('downPayment', value)}
            type="number"
            min="0"
            error={errors.downPayment}
            prefix="$"
          />

          <div className="relative">
            <InputField
              label={t('mortgage_calculator.calculator.interest_rate')}
              id="interestRate"
              placeholder={t('mortgage_calculator.calculator.enter_interest_rate')}
              value={formData.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              type="number"
              min="0"
              max="20"
              step="0.01"
              error={errors.interestRate}
              suffix="%"
              tooltip={
                <Tooltip content={t('mortgage_calculator.calculator.interest_rate_tooltip')} />
              }
            />
          </div>

          <div className="relative">
            <SelectField
              label={t('mortgage_calculator.calculator.amortization')}
              id="amortization"
              value={formData.amortization}
              onChange={(value) => handleInputChange('amortization', value)}
              options={amortizationOptions}
              tooltip={
                <Tooltip content={t('mortgage_calculator.calculator.amortization_tooltip')} />
              }
            />
          </div>

          <SelectField
            label={t('mortgage_calculator.calculator.payment_frequency')}
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
              {t('mortgage_calculator.calculator.calculate')}
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('mortgage_calculator.calculator.clear')}
            </button>
          </div>
        </div>
      </div>

      <CalculatorResults results={results} />
    </div>
  );
};

export default MorgageCalculator;