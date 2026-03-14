'use client'

import { useState, useEffect } from 'react'
import { Disease, Medicine, PatientRecord } from '@/types/database'

interface PatientRecordWithRelations extends PatientRecord {
  diseases?: { id: string; name: string } | null
  medicines?: { id: string; name: string; strength: string | null } | null
}

export default function RecordsPage() {
  const [records, setRecords] = useState<PatientRecordWithRelations[]>([])
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({
    patient_name: '',
    patient_id_number: '',
    age: '',
    weight: '',
    disease_id: '',
    medicine_id: '',
    prescribed_dosage: '',
    frequency: '',
    start_date: '',
    end_date: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [recordsRes, diseasesRes, medicinesRes] = await Promise.all([
        fetch('/api/records'),
        fetch('/api/diseases'),
        fetch('/api/medicines'),
      ])
      if (!recordsRes.ok) throw new Error('Failed to fetch records')
      setRecords(await recordsRes.json())
      if (diseasesRes.ok) setDiseases(await diseasesRes.json())
      if (medicinesRes.ok) setMedicines(await medicinesRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading records')
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setEditingRecord(null)
    setForm({
      patient_name: '', patient_id_number: '', age: '', weight: '',
      disease_id: '', medicine_id: '', prescribed_dosage: '',
      frequency: '', start_date: '', end_date: '', notes: '',
    })
    setShowForm(true)
  }

  function openEditForm(record: PatientRecord) {
    setEditingRecord(record)
    setForm({
      patient_name: record.patient_name,
      patient_id_number: record.patient_id_number ?? '',
      age: record.age?.toString() ?? '',
      weight: record.weight?.toString() ?? '',
      disease_id: record.disease_id ?? '',
      medicine_id: record.medicine_id ?? '',
      prescribed_dosage: record.prescribed_dosage ?? '',
      frequency: record.frequency ?? '',
      start_date: record.start_date ?? '',
      end_date: record.end_date ?? '',
      notes: record.notes ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        disease_id: form.disease_id || null,
        medicine_id: form.medicine_id || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      }
      const url = editingRecord ? `/api/records/${editingRecord.id}` : '/api/records'
      const method = editingRecord ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save record')
      await fetchData()
      setShowForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving record')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบบันทึกนี้ใช่หรือไม่?')) return
    try {
      const res = await fetch(`/api/records/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete record')
      await fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting record')
    }
  }

  const filtered = records.filter(r =>
    r.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.patient_id_number ?? '').includes(searchQuery)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 บันทึกผู้ป่วย</h1>
          <p className="text-gray-500 mt-1">Patient Records</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          + เพิ่มบันทึก
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหาผู้ป่วย..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'ไม่พบผู้ป่วยที่ค้นหา' : 'ยังไม่มีบันทึกผู้ป่วย'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ชื่อผู้ป่วย</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">อายุ/น้ำหนัก</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">โรค</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ยา</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">วันที่เริ่ม</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{record.patient_name}</div>
                        {record.patient_id_number && (
                          <div className="text-xs text-gray-500">{record.patient_id_number}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {record.age && <span>{record.age} ปี</span>}
                        {record.age && record.weight && <span> / </span>}
                        {record.weight && <span>{record.weight} kg</span>}
                        {!record.age && !record.weight && '-'}
                      </td>
                      <td className="px-5 py-4">
                        {record.diseases ? (
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {record.diseases.name}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4">
                        {record.medicines ? (
                          <div>
                            <div className="text-sm font-medium text-gray-800">{record.medicines.name}</div>
                            {record.prescribed_dosage && (
                              <div className="text-xs text-gray-500">{record.prescribed_dosage}</div>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">{record.start_date ?? '-'}</td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button onClick={() => openEditForm(record)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">แก้ไข</button>
                        <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRecord ? '✏️ แก้ไขบันทึกผู้ป่วย' : '➕ เพิ่มบันทึกผู้ป่วย'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ป่วย *</label>
                  <input
                    required
                    type="text"
                    value={form.patient_name}
                    onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน/HN</label>
                  <input
                    type="text"
                    value={form.patient_id_number}
                    onChange={(e) => setForm({ ...form, patient_id_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">อายุ (ปี)</label>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">โรค</label>
                  <select
                    value={form.disease_id}
                    onChange={(e) => setForm({ ...form, disease_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">เลือกโรค</option>
                    {diseases.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ยาที่สั่ง</label>
                  <select
                    value={form.medicine_id}
                    onChange={(e) => setForm({ ...form, medicine_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">เลือกยา</option>
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>{m.name} {m.strength ? `(${m.strength})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ขนาดยาที่สั่ง</label>
                  <input
                    type="text"
                    placeholder="เช่น 500 mg"
                    value={form.prescribed_dosage}
                    onChange={(e) => setForm({ ...form, prescribed_dosage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ความถี่</label>
                  <input
                    type="text"
                    placeholder="เช่น วันละ 3 ครั้ง"
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่ม</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                  {editingRecord ? 'บันทึกการแก้ไข' : 'เพิ่มบันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
