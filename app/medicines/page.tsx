'use client'

import { useState, useEffect } from 'react'
import { Medicine } from '@/types/database'

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({
    name: '',
    generic_name: '',
    dosage_form: '',
    strength: '',
    description: '',
    side_effects: '',
    contraindications: '',
  })

  useEffect(() => {
    fetchMedicines()
  }, [])

  async function fetchMedicines() {
    try {
      setLoading(true)
      const res = await fetch('/api/medicines')
      if (!res.ok) throw new Error('Failed to fetch medicines')
      const data = await res.json()
      setMedicines(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading medicines')
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setEditingMedicine(null)
    setForm({ name: '', generic_name: '', dosage_form: '', strength: '', description: '', side_effects: '', contraindications: '' })
    setShowForm(true)
  }

  function openEditForm(medicine: Medicine) {
    setEditingMedicine(medicine)
    setForm({
      name: medicine.name,
      generic_name: medicine.generic_name ?? '',
      dosage_form: medicine.dosage_form ?? '',
      strength: medicine.strength ?? '',
      description: medicine.description ?? '',
      side_effects: medicine.side_effects ?? '',
      contraindications: medicine.contraindications ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingMedicine ? `/api/medicines/${editingMedicine.id}` : '/api/medicines'
      const method = editingMedicine ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save medicine')
      await fetchMedicines()
      setShowForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving medicine')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบยานี้ใช่หรือไม่?')) return
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete medicine')
      await fetchMedicines()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting medicine')
    }
  }

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.generic_name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💊 ฐานข้อมูลยา</h1>
          <p className="text-gray-500 mt-1">Medicine Database</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + เพิ่มยา
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหายา..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'ไม่พบยาที่ค้นหา' : 'ยังไม่มีข้อมูลยา'}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อยา</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสามัญ</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">รูปแบบ</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ความแรง</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{medicine.name}</td>
                    <td className="px-6 py-4 text-gray-600">{medicine.generic_name ?? '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{medicine.dosage_form ?? '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{medicine.strength ?? '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(medicine)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMedicine ? '✏️ แก้ไขข้อมูลยา' : '➕ เพิ่มยาใหม่'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อยา *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสามัญ</label>
                  <input
                    type="text"
                    value={form.generic_name}
                    onChange={(e) => setForm({ ...form, generic_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รูปแบบยา</label>
                  <select
                    value={form.dosage_form}
                    onChange={(e) => setForm({ ...form, dosage_form: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">เลือกรูปแบบยา</option>
                    <option value="Tablet">Tablet (ยาเม็ด)</option>
                    <option value="Capsule">Capsule (แคปซูล)</option>
                    <option value="Syrup">Syrup (ยาน้ำเชื่อม)</option>
                    <option value="Injection">Injection (ยาฉีด)</option>
                    <option value="Cream">Cream (ครีม)</option>
                    <option value="Ointment">Ointment (ขี้ผึ้ง)</option>
                    <option value="Drops">Drops (ยาหยด)</option>
                    <option value="Inhaler">Inhaler (ยาพ่น)</option>
                    <option value="Suppository">Suppository (ยาเหน็บ)</option>
                    <option value="Patch">Patch (แผ่นแปะ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ความแรง</label>
                  <input
                    type="text"
                    placeholder="เช่น 500 mg, 10 mg/5 mL"
                    value={form.strength}
                    onChange={(e) => setForm({ ...form, strength: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผลข้างเคียง</label>
                <textarea
                  value={form.side_effects}
                  onChange={(e) => setForm({ ...form, side_effects: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ข้อห้ามใช้</label>
                <textarea
                  value={form.contraindications}
                  onChange={(e) => setForm({ ...form, contraindications: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingMedicine ? 'บันทึกการแก้ไข' : 'เพิ่มยา'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
