import React, { useState, useEffect } from 'react';
import { SelectDropdown } from './SelectDropdown';
import { InputField } from './InputField';
import { Results } from './Results';
import { calculateTaxes } from './utils/taxCalculator';
import { provinces, taxYears } from './data/taxData';
import { formatCurrency } from './utils/formatters';
import { minimumWage } from './data/minimumWage';
import { Alert } from './Alert';
import { RRSP_PERCENTAGE_LIMIT, RRSP_DOLLAR_LIMITS, TFSA_LIMITS } from './data/contributionLimits';
import { HelpCircle, Plus, X } from 'lucide-react';
import { Bonus, Deduction } from './types';

export const TaxCalculator: React.FC = () => {
  const [province, setProvince] = useState('');
  const [taxYear, setTaxYear] = useState('2023');
  const [incomeType, setIncomeType] = useState<'annual' | 'hourly'>('annual');
  const [income, setIncome] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [minimumWageAlert, setMinimumWageAlert] = useState<string>('');
  
  const [rrspContributionType, setRrspContributionType] = useState<'percentage' | 'amount'>('percentage');
  const [rrspContribution, setRrspContribution] = useState<string>('');
  const [tfsaContributionType, setTfsaContributionType] = useState<'percentage' | 'amount'>('amount');
  const [tfsaContribution, setTfsaContribution] = useState<string>('');

  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [newBonus, setNewBonus] = useState<Bonus>({
    id: '',
    type: 'percentage',
    amount: 0,
    hours: 0,
    kilometers: 0
  });

  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [newDeduction, setNewDeduction] = useState<Deduction>({
    id: '',
    name: '',
    type: 'percentage',
    amount: 0,
    description: ''
  });

  const calculateAnnualIncome = (): number => {
    let baseIncome = 0;
    if (incomeType === 'annual') {
      baseIncome = parseFloat(income.replace(/,/g, '')) || 0;
    } else {
      const hourlyRate = parseFloat(income) || 0;
      const hours = parseFloat(hoursPerWeek) || 0;
      baseIncome = hourlyRate * hours * 52;
    }

    const bonusIncome = bonuses.reduce((total, bonus) => {
      switch (bonus.type) {
        case 'percentage':
          return total + (baseIncome * (bonus.amount / 100));
        case 'hourly':
          return total + (bonus.amount * (bonus.hours || 0) * 52);
        case 'travel':
          return total + (bonus.amount * (bonus.kilometers || 0) * 52);
        default:
          return total;
      }
    }, 0);

    return baseIncome + bonusIncome;
  };

  const calculateContributions = (annualIncome: number) => {
    const rrspDollarLimit = RRSP_DOLLAR_LIMITS[taxYear];
    const tfsaLimit = TFSA_LIMITS[taxYear];
    
    let rrspAmount = 0;
    if (rrspContribution) {
      if (rrspContributionType === 'percentage') {
        rrspAmount = Math.min(
          annualIncome * (parseFloat(rrspContribution) / 100),
          annualIncome * RRSP_PERCENTAGE_LIMIT,
          rrspDollarLimit
        );
      } else {
        rrspAmount = Math.min(
          parseFloat(rrspContribution),
          annualIncome * RRSP_PERCENTAGE_LIMIT,
          rrspDollarLimit
        );
      }
    }

    let tfsaAmount = 0;
    if (tfsaContribution) {
      if (tfsaContributionType === 'percentage') {
        tfsaAmount = Math.min(
          annualIncome * (parseFloat(tfsaContribution) / 100),
          tfsaLimit
        );
      } else {
        tfsaAmount = Math.min(
          parseFloat(tfsaContribution),
          tfsaLimit
        );
      }
    }

    return { rrspAmount, tfsaAmount };
  };

  const calculateDeductions = (annualIncome: number): { totalDeductions: number; deductionsList: Deduction[] } => {
    const calculatedDeductions = deductions.map(deduction => ({
      ...deduction,
      calculatedAmount: deduction.type === 'percentage' 
        ? annualIncome * (deduction.amount / 100)
        : deduction.amount
    }));

    const total = calculatedDeductions.reduce((sum, d) => sum + (d.calculatedAmount || 0), 0);
    return { 
      totalDeductions: total,
      deductionsList: calculatedDeductions
    };
  };

  useEffect(() => {
    if (incomeType === 'hourly' && province && taxYear && income) {
      const hourlyRate = parseFloat(income);
      const minWage = minimumWage[taxYear]?.[province];
      
      if (minWage && hourlyRate < minWage) {
        setMinimumWageAlert(`The entered hourly wage (${formatCurrency(hourlyRate)}/hr) is below the ${taxYear} minimum wage in ${province} (${formatCurrency(minWage)}/hr)`);
      } else {
        setMinimumWageAlert('');
      }
    } else {
      setMinimumWageAlert('');
    }
  }, [income, province, taxYear, incomeType]);

  const handleCalculate = () => {
    if (!province || !taxYear || !income || (incomeType === 'hourly' && !hoursPerWeek)) {
      alert('Please fill all required fields before calculating');
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      const annualIncome = calculateAnnualIncome();
      const { rrspAmount, tfsaAmount } = calculateContributions(annualIncome);
      const { totalDeductions, deductionsList } = calculateDeductions(annualIncome);
      
      const calculationResults = calculateTaxes(province, taxYear, annualIncome - rrspAmount);
      
      const finalResults = {
        ...calculationResults,
        rrspContribution: rrspAmount,
        tfsaContribution: tfsaAmount,
        deductions: deductionsList,
        takeHomeAfterContributions: calculationResults.netIncome - tfsaAmount - totalDeductions
      };
      
      setResults(finalResults);
      setIsCalculating(false);
    }, 500);
  };

  const handleClear = () => {
    setProvince('');
    setTaxYear('2023');
    setIncome('');
    setHoursPerWeek('40');
    setRrspContribution('');
    setTfsaContribution('');
    setBonuses([]);
    setResults(null);
    setMinimumWageAlert('');
  };

  const handleIncomeChange = (value: string) => {
    const formattedValue = value.replace(/[^\d.]/g, '');
    setIncome(formattedValue);
  };

  const handleHoursChange = (value: string) => {
    const formattedValue = value.replace(/[^\d.]/g, '');
    setHoursPerWeek(formattedValue);
  };

  const handleAddBonus = () => {
    if (newBonus.amount <= 0) {
      alert('Please enter a valid bonus amount');
      return;
    }

    setBonuses([...bonuses, { ...newBonus, id: Date.now().toString() }]);
    setNewBonus({
      id: '',
      type: 'percentage',
      amount: 0,
      hours: 0,
      kilometers: 0
    });
    setShowBonusForm(false);
  };

  const handleRemoveBonus = (id: string) => {
    setBonuses(bonuses.filter(bonus => bonus.id !== id));
  };

  const handleAddDeduction = () => {
    if (!newDeduction.name || newDeduction.amount <= 0) {
      alert('Please enter a valid deduction name and amount');
      return;
    }

    setDeductions([...deductions, { ...newDeduction, id: Date.now().toString() }]);
    setNewDeduction({
      id: '',
      name: '',
      type: 'percentage',
      amount: 0,
      description: ''
    });
    setShowDeductionForm(false);
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Calculate Your Net Income</h2>
        
        <div className="space-y-6">
          <SelectDropdown
            label="Province/Territory"
            value={province}
            onChange={setProvince}
            options={provinces.map(p => ({ value: p.code, label: p.name }))}
            placeholder="Select province or territory"
          />
          
          <SelectDropdown
            label="Tax Year"
            value={taxYear}
            onChange={setTaxYear}
            options={taxYears.map(year => ({ value: year, label: year }))}
            placeholder="Select tax year"
          />

          <div className="flex gap-4 items-center">
            <label className="flex items-center">
              <input
                type="radio"
                value="annual"
                checked={incomeType === 'annual'}
                onChange={(e) => setIncomeType('annual')}
                className="mr-2"
              />
              Annual Income
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="hourly"
                checked={incomeType === 'hourly'}
                onChange={(e) => setIncomeType('hourly')}
                className="mr-2"
              />
              Hourly Wage
            </label>
          </div>
          
          {minimumWageAlert && (
            <Alert message={minimumWageAlert} />
          )}

          <InputField
            label={incomeType === 'annual' ? "Annual Gross Income" : "Hourly Wage"}
            value={income}
            onChange={handleIncomeChange}
            placeholder={incomeType === 'annual' ? "Enter your annual gross income" : "Enter your hourly wage"}
            type="text"
            prefix="$"
          />

          {incomeType === 'hourly' && (
            <InputField
              label="Hours per Week"
              value={hoursPerWeek}
              onChange={handleHoursChange}
              placeholder="Enter hours worked per week"
              type="text"
            />
          )}

          <div className="border-t border-blue-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bonuses & Premiums</h3>
              <button
                onClick={() => setShowBonusForm(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Bonus
              </button>
            </div>

            {showBonusForm && (
              <div className="bg-blue-700 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={newBonus.type}
                      onChange={(e) => setNewBonus({ ...newBonus, type: e.target.value as Bonus['type'] })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                    >
                      <option value="percentage">Percentage of Base</option>
                      <option value="hourly">Hourly Premium</option>
                      <option value="travel">Travel Allowance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {newBonus.type === 'percentage' ? 'Percentage' : 
                       newBonus.type === 'hourly' ? 'Hourly Rate' : 
                       'Rate per KM'}
                    </label>
                    <input
                      type="number"
                      value={newBonus.amount || ''}
                      onChange={(e) => setNewBonus({ ...newBonus, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                {newBonus.type === 'hourly' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Hours per Week</label>
                    <input
                      type="number"
                      value={newBonus.hours || ''}
                      onChange={(e) => setNewBonus({ ...newBonus, hours: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                      placeholder="Enter hours"
                    />
                  </div>
                )}

                {newBonus.type === 'travel' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Kilometers per Week</label>
                    <input
                      type="number"
                      value={newBonus.kilometers || ''}
                      onChange={(e) => setNewBonus({ ...newBonus, kilometers: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                      placeholder="Enter kilometers"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowBonusForm(false)}
                    className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBonus}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {bonuses.length > 0 && (
              <div className="space-y-2 mb-4">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between bg-blue-700 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">
                        {bonus.type === 'percentage' ? `${bonus.amount}% of base salary` :
                         bonus.type === 'hourly' ? `${formatCurrency(bonus.amount)}/hr for ${bonus.hours}h/week` :
                         `${formatCurrency(bonus.amount)}/km for ${bonus.kilometers}km/week`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveBonus(bonus.id)}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-blue-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Retirement Savings</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">RRSP Contribution</label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-blue-200 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-white text-gray-800 text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <p className="mb-2"><strong>Registered Retirement Savings Plan (RRSP)</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Reduces your taxable income</li>
                          <li>Limit: 18% of previous year's income</li>
                          <li>Maximum {formatCurrency(RRSP_DOLLAR_LIMITS[taxYear])} for {taxYear}</li>
                          <li>Tax-deferred growth until withdrawal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="percentage"
                        checked={rrspContributionType === 'percentage'}
                        onChange={() => setRrspContributionType('percentage')}
                        className="mr-1"
                      />
                      %
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="amount"
                        checked={rrspContributionType === 'amount'}
                        onChange={() => setRrspContributionType('amount')}
                        className="mr-1"
                      />
                      $
                    </label>
                  </div>
                </div>
                <InputField
                  value={rrspContribution}
                  onChange={setRrspContribution}
                  placeholder={rrspContributionType === 'percentage' ? "Enter percentage" : "Enter amount"}
                  prefix={rrspContributionType === 'amount' ? "$" : undefined}
                  suffix={rrspContributionType === 'percentage' ? "%" : undefined} label={''}                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">TFSA Contribution</label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-blue-200 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-white text-gray-800 text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <p className="mb-2"><strong>Tax-Free Savings Account (TFSA)</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>After-tax contributions</li>
                          <li>Tax-free growth and withdrawals</li>
                          <li>Limit: {formatCurrency(TFSA_LIMITS[taxYear])} for {taxYear}</li>
                          <li>Flexible withdrawals anytime</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="percentage"
                        checked={tfsaContributionType === 'percentage'}
                        onChange={() => setTfsaContributionType('percentage')}
                        className="mr-1"
                      />
                      %
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="amount"
                        checked={tfsaContributionType === 'amount'}
                        onChange={() => setTfsaContributionType('amount')}
                        className="mr-1"
                      />
                      $
                    </label>
                  </div>
                </div>
                <InputField
                  value={tfsaContribution}
                  onChange={setTfsaContribution}
                  placeholder={tfsaContributionType === 'percentage' ? "Enter percentage" : "Enter amount"}
                  prefix={tfsaContributionType === 'amount' ? "$" : undefined}
                  suffix={tfsaContributionType === 'percentage' ? "%" : undefined} label={''}                />
              </div>
            </div>
          </div>

          <div className="border-t border-blue-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Other Deductions</h3>
              <button
                onClick={() => setShowDeductionForm(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Deduction
              </button>
            </div>

            {showDeductionForm && (
              <div className="bg-blue-700 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={newDeduction.name}
                      onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                      placeholder="e.g., Union Dues"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={newDeduction.type}
                      onChange={(e) => setNewDeduction({ ...newDeduction, type: e.target.value as 'percentage' | 'amount' })}
                      className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="amount">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {newDeduction.type === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={newDeduction.amount || ''}
                    onChange={(e) => setNewDeduction({ ...newDeduction, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                    placeholder={newDeduction.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    step={newDeduction.type === 'percentage' ? '0.01' : '1'}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={newDeduction.description || ''}
                    onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-50 text-gray-800 rounded-lg"
                    placeholder="Add a description"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeductionForm(false)}
                    className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDeduction}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {deductions.length > 0 && (
              <div className="space-y-2 mb-4">
                {deductions.map((deduction) => (
                  <div key={deduction.id} className="flex items-center justify-between bg-blue-700 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">
                        {deduction.name}: {deduction.type === 'percentage' ? `${deduction.amount}%` : formatCurrency(deduction.amount)}
                      </span>
                      {deduction.description && (
                        <p className="text-sm text-blue-200">{deduction.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveDeduction(deduction.id)}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-4 pt-2">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                isCalculating 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </button>
            <button
              onClick={handleClear}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 rounded-lg font-medium transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {results && (
        <Results 
          results={results} 
          grossIncome={calculateAnnualIncome()} 
          province={province}
          taxYear={taxYear}
        />
      )}
    </div>
  );
};