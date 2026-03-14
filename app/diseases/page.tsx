'use client'

import { useState, useEffect } from 'react'
import { Disease, Medicine } from '@/types/database'

interface DiseaseWithMedicines extends Disease {
  disease_medicine_mapping?: Array<{
    id: string
    recommended_dosage: string | null
    frequency: string | null
    notes: string | null
    medicines: Medicine
  }>
}

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<DiseaseWithMedicines[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showMappingForm, setShowMappingForm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({ name: '', description: '', icd_code: '' })
  const [mappingForm, setMappingForm] = useState({
    medicine_id: '',
    recommended_dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [diseasesRes, medicinesRes] = await Promise.all([
        fetch('/api/diseases'),
        fetch('/api/medicines'),
      ])
      if (!diseasesRes.ok || !medicinesRes.ok) throw new Error('Failed to fetch data')
      setDiseases(await diseasesRes.json())
      setMedicines(await medicinesRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchDiseaseDetail(id: string) {
    const res = await fetch(`/api/diseases/${id}`)
    if (!res.ok) return
    const updated = await res.json()
    setDiseases(prev => prev.map(d => d.id === id ? updated : d))
  }

  function openAddForm() {
    setEditingDisease(null)
    setForm({ name: '', description: '', icd_code: '' })
    setShowForm(true)
  }

  function openEditForm(disease: Disease) {
    setEditingDisease(disease)
    setForm({
      name: disease.name,
      description: disease.description ?? '',
      icd_code: disease.icd_code ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingDisease ? `/api/diseases/${editingDisease.id}` : '/api/diseases'
      const method = editingDisease ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save disease')
      await fetchData()
      setShowForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving disease')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบโรคนี้ใช่หรือไม่?')) return
    try {
      const res = await fetch(`/api/diseases/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete disease')
      await fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting disease')
    }
  }

  async function handleAddMapping(diseaseId: string) {
    try {
      const res = await fetch('/api/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease_id: diseaseId, ...mappingForm }),
      })
      if (!res.ok) throw new Error('Failed to add mapping')
      setShowMappingForm(null)
      setMappingForm({ medicine_id: '', recommended_dosage: '', frequency: '', duration: '', notes: '' })
      await fetchDiseaseDetail(diseaseId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error adding medicine')
    }
  }

  async function handleRemoveMapping(mappingId: string, diseaseId: string) {
    if (!confirm('ต้องการลบยานี้จากโรคใช่หรือไม่?')) return
    try {
      const res = await fetch(`/api/mappings?id=${mappingId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove mapping')
      await fetchDiseaseDetail(diseaseId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error removing medicine')
    }
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      fetchDiseaseDetail(id)
    }
  }

  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.icd_code ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏥 ฐานข้อมูลโรค</h1>
          <p className="text-gray-500 mt-1">Disease Database</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          + เพิ่มโรค
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหาโรค..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow">
              {searchQuery ? 'ไม่พบโรคที่ค้นหา' : 'ยังไม่มีข้อมูลโรค'}
            </div>
          ) : (
            filtered.map((disease) => (
              <div key={disease.id} className="bg-white rounded-xl shadow">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{disease.name}</h3>
                      {disease.icd_code && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-mono">
                          {disease.icd_code}
                        </span>
                      )}
                    </div>
                    {disease.description && (
                      <p className="text-gray-500 text-sm mt-1">{disease.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpand(disease.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50"
                    >
                      {expandedId === disease.id ? '▲ ซ่อนยา' : '▼ ดูยา'}
                    </button>
                    <button onClick={() => openEditForm(disease)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">แก้ไข</button>
                    <button onClick={() => handleDelete(disease.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">ลบ</button>
                  </div>
                </div>

                {expandedId === disease.id && (
                  <div className="border-t border-gray-100 px-5 pb-5">
                    <div className="flex items-center justify-between mt-4 mb-3">
                      <h4 className="font-medium text-gray-700">💊 ยาที่ใช้รักษา</h4>
                      <button
                        onClick={() => setShowMappingForm(showMappingForm === disease.id ? null : disease.id)}
                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100"
                      >
                        + เพิ่มยา
                      </button>
                    </div>

                    {showMappingForm === disease.id && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">เลือกยา *</label>
                            <select
                              value={mappingForm.medicine_id}
                              onChange={(e) => setMappingForm({ ...mappingForm, medicine_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">เลือกยา</option>
                              {medicines.map(m => (
                                <option key={m.id} value={m.id}>{m.name} {m.strength ? `(${m.strength})` : ''}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">ขนาดที่แนะนำ</label>
                            <input
                              type="text"
                              placeholder="เช่น 500 mg"
                              value={mappingForm.recommended_dosage}
                              onChange={(e) => setMappingForm({ ...mappingForm, recommended_dosage: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">ความถี่</label>
                            <input
                              type="text"
                              placeholder="เช่น วันละ 2 ครั้ง"
                              value={mappingForm.frequency}
                              onChange={(e) => setMappingForm({ ...mappingForm, frequency: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">ระยะเวลา</label>
                            <input
                              type="text"
                              placeholder="เช่น 7 วัน"
                              value={mappingForm.duration}
                              onChange={(e) => setMappingForm({ ...mappingForm, duration: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleAddMapping(disease.id)}
                            disabled={!mappingForm.medicine_id}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => setShowMappingForm(null)}
                            className="text-gray-600 px-4 py-1.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    )}

                    {disease.disease_medicine_mapping && disease.disease_medicine_mapping.length > 0 ? (
                      <div className="space-y-2">
                        {disease.disease_medicine_mapping.map((mapping) => (
                          <div key={mapping.id} className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg">
                            <div>
                              <span className="font-medium text-blue-900">{mapping.medicines.name}</span>
                              {mapping.recommended_dosage && <span className="text-blue-700 text-sm ml-2">({mapping.recommended_dosage})</span>}
                              {mapping.frequency && <span className="text-blue-600 text-sm ml-2">• {mapping.frequency}</span>}
                            </div>
                            <button
                              onClick={() => handleRemoveMapping(mapping.id, disease.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">ยังไม่มียาที่เชื่อมโยง</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDisease ? '✏️ แก้ไขข้อมูลโรค' : '➕ เพิ่มโรคใหม่'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโรค *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัส ICD</label>
                <input
                  type="text"
                  placeholder="เช่น I10, E11"
                  value={form.icd_code}
                  onChange={(e) => setForm({ ...form, icd_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  {editingDisease ? 'บันทึกการแก้ไข' : 'เพิ่มโรค'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
