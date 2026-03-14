'use client'

import { useState } from 'react'

interface CalculatorResult {
  value: number
  unit: string
  interpretation?: string
}

export default function CalculationsPage() {
  const [activeCalc, setActiveCalc] = useState<string>('bmi')

  // BMI
  const [bmiForm, setBmiForm] = useState({ weight: '', height: '' })
  const [bmiResult, setBmiResult] = useState<CalculatorResult | null>(null)

  // CrCl (Cockcroft-Gault)
  const [crclForm, setCrclForm] = useState({ age: '', weight: '', creatinine: '', gender: 'male' })
  const [crclResult, setCrclResult] = useState<CalculatorResult | null>(null)

  // IBW
  const [ibwForm, setIbwForm] = useState({ height: '', gender: 'male' })
  const [ibwResult, setIbwResult] = useState<CalculatorResult | null>(null)

  // Total Daily Dose
  const [tddForm, setTddForm] = useState({ dose: '', frequency: '' })
  const [tddResult, setTddResult] = useState<CalculatorResult | null>(null)

  // BSA (Mosteller)
  const [bsaForm, setBsaForm] = useState({ weight: '', height: '' })
  const [bsaResult, setBsaResult] = useState<CalculatorResult | null>(null)

  function calcBMI() {
    const w = parseFloat(bmiForm.weight)
    const h = parseFloat(bmiForm.height) / 100
    if (!w || !h) return
    const bmi = w / (h * h)
    let interpretation = ''
    if (bmi < 18.5) interpretation = 'น้ำหนักน้อยกว่าเกณฑ์ (Underweight)'
    else if (bmi < 23) interpretation = 'น้ำหนักปกติ (Normal weight)'
    else if (bmi < 25) interpretation = 'น้ำหนักเกินเล็กน้อย (Overweight)'
    else if (bmi < 30) interpretation = 'อ้วน (Obese Class I)'
    else interpretation = 'อ้วนมาก (Obese Class II+)'
    setBmiResult({ value: parseFloat(bmi.toFixed(2)), unit: 'kg/m²', interpretation })
  }

  function calcCrCl() {
    const age = parseFloat(crclForm.age)
    const weight = parseFloat(crclForm.weight)
    const cr = parseFloat(crclForm.creatinine)
    if (!age || !weight || !cr) return
    let crcl = ((140 - age) * weight) / (72 * cr)
    if (crclForm.gender === 'female') crcl *= 0.85
    let interpretation = ''
    if (crcl >= 90) interpretation = 'ไตทำงานปกติ (Normal)'
    else if (crcl >= 60) interpretation = 'ไตเสื่อมเล็กน้อย (Mild CKD)'
    else if (crcl >= 30) interpretation = 'ไตเสื่อมปานกลาง (Moderate CKD)'
    else if (crcl >= 15) interpretation = 'ไตเสื่อมรุนแรง (Severe CKD)'
    else interpretation = 'ไตวาย (Kidney Failure)'
    setCrclResult({ value: parseFloat(crcl.toFixed(1)), unit: 'mL/min', interpretation })
  }

  function calcIBW() {
    const height = parseFloat(ibwForm.height)
    if (!height) return
    const heightInch = height / 2.54
    if (heightInch < 60) {
      setIbwResult({ value: ibwForm.gender === 'male' ? 50 : 45.5, unit: 'kg',
        interpretation: 'ส่วนสูงน้อยกว่า 60 นิ้ว ใช้ค่าฐาน (50 kg ชาย / 45.5 kg หญิง)' })
      return
    }
    let ibw: number
    if (ibwForm.gender === 'male') {
      ibw = 50 + 2.3 * (heightInch - 60)
    } else {
      ibw = 45.5 + 2.3 * (heightInch - 60)
    }
    setIbwResult({ value: parseFloat(ibw.toFixed(1)), unit: 'kg' })
  }

  function calcTDD() {
    const dose = parseFloat(tddForm.dose)
    const freq = parseFloat(tddForm.frequency)
    if (!dose || !freq) return
    const tdd = dose * freq
    setTddResult({ value: parseFloat(tdd.toFixed(2)), unit: 'mg/day' })
  }

  function calcBSA() {
    const w = parseFloat(bsaForm.weight)
    const h = parseFloat(bsaForm.height)
    if (!w || !h) return
    const bsa = Math.sqrt((w * h) / 3600)
    setBsaResult({ value: parseFloat(bsa.toFixed(2)), unit: 'm²' })
  }

  const calculators = [
    { id: 'bmi', label: 'BMI', icon: '⚖️', description: 'Body Mass Index' },
    { id: 'crcl', label: 'CrCl', icon: '🫘', description: 'Creatinine Clearance' },
    { id: 'ibw', label: 'IBW', icon: '📏', description: 'Ideal Body Weight' },
    { id: 'tdd', label: 'TDD', icon: '💊', description: 'Total Daily Dose' },
    { id: 'bsa', label: 'BSA', icon: '🧑', description: 'Body Surface Area' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🧮 เครื่องมือคำนวณ</h1>
        <p className="text-gray-500 mt-1">Pharmacist Calculation Tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">เลือกเครื่องคำนวณ</h3>
            <div className="space-y-1">
              {calculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalc(calc.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    activeCalc === calc.id
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{calc.icon}</span>
                  <span className="font-medium">{calc.label}</span>
                  <span className="block text-xs text-gray-400 ml-6">{calc.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculator Panel */}
        <div className="lg:col-span-3">
          {/* BMI */}
          {activeCalc === 'bmi' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">⚖️ BMI Calculator</h2>
              <p className="text-gray-500 text-sm mb-6">Body Mass Index — ดัชนีมวลกาย</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (kg)</label>
                  <input
                    type="number" step="0.1" min="0"
                    value={bmiForm.weight}
                    onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                    placeholder="เช่น 65"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (cm)</label>
                  <input
                    type="number" step="0.1" min="0"
                    value={bmiForm.height}
                    onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                    placeholder="เช่น 170"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <button onClick={calcBMI} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">คำนวณ</button>
              {bmiResult && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-700">{bmiResult.value} <span className="text-lg">{bmiResult.unit}</span></div>
                  <div className="text-orange-600 mt-1">{bmiResult.interpretation}</div>
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>สูตร:</strong> BMI = น้ำหนัก (kg) ÷ ส่วนสูง² (m)
              </div>
            </div>
          )}

          {/* CrCl */}
          {activeCalc === 'crcl' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">🫘 Creatinine Clearance</h2>
              <p className="text-gray-500 text-sm mb-6">Cockcroft-Gault Equation — ค่าการกรองของไต</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อายุ (ปี)</label>
                  <input type="number" min="0" value={crclForm.age} onChange={(e) => setCrclForm({ ...crclForm, age: e.target.value })} placeholder="เช่น 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (kg)</label>
                  <input type="number" step="0.1" min="0" value={crclForm.weight} onChange={(e) => setCrclForm({ ...crclForm, weight: e.target.value })} placeholder="เช่น 65"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serum Creatinine (mg/dL)</label>
                  <input type="number" step="0.01" min="0" value={crclForm.creatinine} onChange={(e) => setCrclForm({ ...crclForm, creatinine: e.target.value })} placeholder="เช่น 1.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เพศ</label>
                  <select value={crclForm.gender} onChange={(e) => setCrclForm({ ...crclForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="male">ชาย</option>
                    <option value="female">หญิง (×0.85)</option>
                  </select>
                </div>
              </div>
              <button onClick={calcCrCl} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">คำนวณ</button>
              {crclResult && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-700">{crclResult.value} <span className="text-lg">{crclResult.unit}</span></div>
                  <div className="text-orange-600 mt-1">{crclResult.interpretation}</div>
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>สูตร:</strong> CrCl = ((140 - อายุ) × น้ำหนัก) ÷ (72 × SCr) × 0.85 (หญิง)
              </div>
            </div>
          )}

          {/* IBW */}
          {activeCalc === 'ibw' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">📏 Ideal Body Weight</h2>
              <p className="text-gray-500 text-sm mb-6">Devine Formula — น้ำหนักตัวในอุดมคติ</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (cm)</label>
                  <input type="number" step="0.1" min="0" value={ibwForm.height} onChange={(e) => setIbwForm({ ...ibwForm, height: e.target.value })} placeholder="เช่น 170"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เพศ</label>
                  <select value={ibwForm.gender} onChange={(e) => setIbwForm({ ...ibwForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
              </div>
              <button onClick={calcIBW} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">คำนวณ</button>
              {ibwResult && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-700">{ibwResult.value} <span className="text-lg">{ibwResult.unit}</span></div>
                  {ibwResult.interpretation && (
                    <div className="text-orange-600 mt-1 text-sm">{ibwResult.interpretation}</div>
                  )}
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>สูตร (ชาย):</strong> IBW = 50 + 2.3 × (ส่วนสูง(นิ้ว) - 60)<br />
                <strong>สูตร (หญิง):</strong> IBW = 45.5 + 2.3 × (ส่วนสูง(นิ้ว) - 60)
              </div>
            </div>
          )}

          {/* Total Daily Dose */}
          {activeCalc === 'tdd' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">💊 Total Daily Dose</h2>
              <p className="text-gray-500 text-sm mb-6">คำนวณขนาดยารวมต่อวัน</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ขนาดยาต่อครั้ง (mg)</label>
                  <input type="number" step="0.1" min="0" value={tddForm.dose} onChange={(e) => setTddForm({ ...tddForm, dose: e.target.value })} placeholder="เช่น 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนครั้งต่อวัน</label>
                  <select value={tddForm.frequency} onChange={(e) => setTddForm({ ...tddForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">เลือก</option>
                    <option value="1">1 ครั้ง/วัน (OD)</option>
                    <option value="2">2 ครั้ง/วัน (BID)</option>
                    <option value="3">3 ครั้ง/วัน (TID)</option>
                    <option value="4">4 ครั้ง/วัน (QID)</option>
                    <option value="6">6 ครั้ง/วัน (q4h)</option>
                    <option value="8">8 ครั้ง/วัน (q3h)</option>
                  </select>
                </div>
              </div>
              <button onClick={calcTDD} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">คำนวณ</button>
              {tddResult && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-700">{tddResult.value} <span className="text-lg">{tddResult.unit}</span></div>
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>สูตร:</strong> TDD = ขนาดยาต่อครั้ง (mg) × จำนวนครั้งต่อวัน
              </div>
            </div>
          )}

          {/* BSA */}
          {activeCalc === 'bsa' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">🧑 Body Surface Area</h2>
              <p className="text-gray-500 text-sm mb-6">Mosteller Formula — พื้นที่ผิวกาย</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (kg)</label>
                  <input type="number" step="0.1" min="0" value={bsaForm.weight} onChange={(e) => setBsaForm({ ...bsaForm, weight: e.target.value })} placeholder="เช่น 65"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (cm)</label>
                  <input type="number" step="0.1" min="0" value={bsaForm.height} onChange={(e) => setBsaForm({ ...bsaForm, height: e.target.value })} placeholder="เช่น 170"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <button onClick={calcBSA} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">คำนวณ</button>
              {bsaResult && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-700">{bsaResult.value} <span className="text-lg">{bsaResult.unit}</span></div>
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>สูตร (Mosteller):</strong> BSA = √(น้ำหนัก(kg) × ส่วนสูง(cm) ÷ 3600)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
