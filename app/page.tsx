import Link from 'next/link'

export default function HomePage() {
  const modules = [
    {
      title: 'ยา',
      titleEn: 'Medicines',
      description: 'จัดการฐานข้อมูลยา รายละเอียด ขนาดยา และผลข้างเคียง',
      href: '/medicines',
      icon: '💊',
      color: 'bg-blue-500',
    },
    {
      title: 'โรค',
      titleEn: 'Diseases',
      description: 'จัดการข้อมูลโรคและยาที่ใช้รักษา',
      href: '/diseases',
      icon: '🏥',
      color: 'bg-green-500',
    },
    {
      title: 'บันทึกผู้ป่วย',
      titleEn: 'Patient Records',
      description: 'บันทึกและติดตามข้อมูลผู้ป่วย การรักษา และยาที่ใช้',
      href: '/records',
      icon: '📋',
      color: 'bg-purple-500',
    },
    {
      title: 'เครื่องคำนวณ',
      titleEn: 'Calculations',
      description: 'คำนวณค่าต่างๆ เช่น BMI, ขนาดยา, การทำงานของไต',
      href: '/calculations',
      icon: '🧮',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ⚕️ ระบบจัดการข้อมูลเภสัชกรรม
        </h1>
        <p className="text-xl text-gray-600">
          Pharmacist Management System
        </p>
        <p className="mt-2 text-gray-500">
          จัดการข้อมูลยา โรค ผู้ป่วย และเครื่องมือคำนวณสำหรับเภสัชกร
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div className={`${module.color} p-4 flex items-center`}>
              <span className="text-4xl mr-3">{module.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{module.title}</h2>
                <p className="text-white text-opacity-90 text-sm">{module.titleEn}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600">{module.description}</p>
              <div className="mt-3 flex items-center text-blue-600 font-medium text-sm">
                <span>เข้าใช้งาน</span>
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">เกี่ยวกับระบบ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">💊</div>
            <div className="text-sm text-gray-600">ฐานข้อมูลยา</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">🔗</div>
            <div className="text-sm text-gray-600">เชื่อมโยงข้อมูล</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-600">ติดตามผู้ป่วย</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-1">🧮</div>
            <div className="text-sm text-gray-600">คำนวณค่าต่างๆ</div>
          </div>
        </div>
      </div>
    </div>
  )
}
