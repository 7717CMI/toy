'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react'

interface SupplierData {
  companyName: string
  yearEstablished: number
  headquarters: string
  employees: string
  revenue: string
  keyContact: string
  designation: string
  email: string
  phone: string
  linkedin: string
  website: string
  coreToyCategory: string
  ageGroupFocus: string
  materialExpertise: string
  productPositioning: string
  manufacturingModel: string
  productionCapacity: string
  certifications: string
}

const DEMO_SUPPLIERS: SupplierData[] = [
  {
    companyName: 'ToyTech Industries',
    yearEstablished: 1998,
    headquarters: 'Los Angeles, CA',
    employees: '1,200–1,500',
    revenue: '$180M',
    keyContact: 'James Mitchell',
    designation: 'VP Sales',
    email: 'j.mitchell@toytech.com',
    phone: '+1 (310) 555-0142',
    linkedin: 'linkedin.com/in/jmitchell',
    website: 'www.toytech.com',
    coreToyCategory: 'Electronic & Tech-Enabled',
    ageGroupFocus: '5–12 years',
    materialExpertise: 'Plastic, Electronic, PCB',
    productPositioning: 'Mid-range / Premium',
    manufacturingModel: 'In-house + Outsourced',
    productionCapacity: '2.5M units/year',
    certifications: 'ASTM F963, CPSIA, EN71',
  },
  {
    companyName: 'BrickWonders Co.',
    yearEstablished: 2005,
    headquarters: 'Chicago, IL',
    employees: '800–1,000',
    revenue: '$95M',
    keyContact: 'Sarah Chen',
    designation: 'Director, Partnerships',
    email: 's.chen@brickwonders.com',
    phone: '+1 (312) 555-0198',
    linkedin: 'linkedin.com/in/sarahchen',
    website: 'www.brickwonders.com',
    coreToyCategory: 'Construction & Block-Building',
    ageGroupFocus: '3–12 years',
    materialExpertise: 'ABS Plastic, Magnetic',
    productPositioning: 'Mass-market / Mid-range',
    manufacturingModel: 'In-house',
    productionCapacity: '5M units/year',
    certifications: 'ASTM F963, EN71, ISO 8124',
  },
  {
    companyName: 'STEMPlay Labs',
    yearEstablished: 2012,
    headquarters: 'Boston, MA',
    employees: '350–500',
    revenue: '$42M',
    keyContact: 'Dr. Anil Kapoor',
    designation: 'CEO',
    email: 'anil@stemplay.com',
    phone: '+1 (617) 555-0267',
    linkedin: 'linkedin.com/in/anilkapoor',
    website: 'www.stemplaylabs.com',
    coreToyCategory: 'STEM / Educational',
    ageGroupFocus: '5–12 years',
    materialExpertise: 'Wood, Plastic, Electronic',
    productPositioning: 'Premium',
    manufacturingModel: 'Outsourced (China)',
    productionCapacity: '1.2M units/year',
    certifications: 'ASTM F963, CPSIA',
  },
  {
    companyName: 'HeroVerse Toys',
    yearEstablished: 2001,
    headquarters: 'New York, NY',
    employees: '2,000–2,500',
    revenue: '$310M',
    keyContact: 'Maria Gonzales',
    designation: 'SVP Global Supply',
    email: 'm.gonzales@heroverse.com',
    phone: '+1 (212) 555-0331',
    linkedin: 'linkedin.com/in/mgonzales',
    website: 'www.heroverse.com',
    coreToyCategory: 'Licensed / Theme Toys',
    ageGroupFocus: '3–12 years',
    materialExpertise: 'Plastic, Plush, Die-cast',
    productPositioning: 'Mass-market / Mid-range',
    manufacturingModel: 'Hybrid',
    productionCapacity: '8M units/year',
    certifications: 'ASTM F963, CPSIA, EN71',
  },
  {
    companyName: 'CollectAll Inc.',
    yearEstablished: 2008,
    headquarters: 'Dallas, TX',
    employees: '600–800',
    revenue: '$78M',
    keyContact: 'Tom Rivera',
    designation: 'Head of Sales',
    email: 't.rivera@collectall.com',
    phone: '+1 (214) 555-0419',
    linkedin: 'linkedin.com/in/triveratoys',
    website: 'www.collectall.com',
    coreToyCategory: 'Collectibles & Hobby',
    ageGroupFocus: 'Teens & Adults (12+)',
    materialExpertise: 'PVC, Resin, Paper/Card',
    productPositioning: 'Mid-range / Premium',
    manufacturingModel: 'Outsourced (Japan, China)',
    productionCapacity: '3M units/year',
    certifications: 'ASTM F963, CPSIA',
  },
  {
    companyName: 'PlaySafe Creations',
    yearEstablished: 2015,
    headquarters: 'Portland, OR',
    employees: '150–200',
    revenue: '$18M',
    keyContact: 'Emma Johansson',
    designation: 'Founder & CEO',
    email: 'emma@playsafe.com',
    phone: '+1 (503) 555-0587',
    linkedin: 'linkedin.com/in/emmajohansson',
    website: 'www.playsafecreations.com',
    coreToyCategory: 'STEM / Educational',
    ageGroupFocus: '0–3 years',
    materialExpertise: 'Wood, Organic Cotton, Silicone',
    productPositioning: 'Premium',
    manufacturingModel: 'In-house',
    productionCapacity: '400K units/year',
    certifications: 'ASTM F963, CPSIA, EN71, GOTS',
  },
  {
    companyName: 'MegaBuild Toys',
    yearEstablished: 1995,
    headquarters: 'Detroit, MI',
    employees: '1,500–2,000',
    revenue: '$220M',
    keyContact: 'Robert Kim',
    designation: 'Chief Commercial Officer',
    email: 'r.kim@megabuild.com',
    phone: '+1 (313) 555-0621',
    linkedin: 'linkedin.com/in/robertkim',
    website: 'www.megabuildtoys.com',
    coreToyCategory: 'Construction & Block-Building',
    ageGroupFocus: '5–12 years',
    materialExpertise: 'Plastic, Metal, Electronic',
    productPositioning: 'Mass-market',
    manufacturingModel: 'In-house + Outsourced',
    productionCapacity: '10M units/year',
    certifications: 'ASTM F963, EN71, ISO 8124',
  },
  {
    companyName: 'FunBot Robotics',
    yearEstablished: 2017,
    headquarters: 'San Jose, CA',
    employees: '200–350',
    revenue: '$28M',
    keyContact: 'Lisa Park',
    designation: 'VP Business Dev',
    email: 'l.park@funbot.io',
    phone: '+1 (408) 555-0734',
    linkedin: 'linkedin.com/in/lisapark',
    website: 'www.funbot.io',
    coreToyCategory: 'Electronic & Tech-Enabled',
    ageGroupFocus: '5–12 years',
    materialExpertise: 'Electronic, Plastic, Sensors',
    productPositioning: 'Premium',
    manufacturingModel: 'Outsourced (Shenzhen)',
    productionCapacity: '800K units/year',
    certifications: 'ASTM F963, CPSIA, FCC',
  },
  {
    companyName: 'ThemeWorld Licensing',
    yearEstablished: 2003,
    headquarters: 'Orlando, FL',
    employees: '900–1,200',
    revenue: '$145M',
    keyContact: 'David Williams',
    designation: 'Managing Director',
    email: 'd.williams@themeworld.com',
    phone: '+1 (407) 555-0856',
    linkedin: 'linkedin.com/in/dwilliams',
    website: 'www.themeworldtoys.com',
    coreToyCategory: 'Licensed / Theme Toys',
    ageGroupFocus: '3–5 years',
    materialExpertise: 'Plush, Plastic, Fabric',
    productPositioning: 'Mass-market / Mid-range',
    manufacturingModel: 'Hybrid',
    productionCapacity: '6M units/year',
    certifications: 'ASTM F963, CPSIA, EN71',
  },
  {
    companyName: 'TinyGenius Corp',
    yearEstablished: 2019,
    headquarters: 'Austin, TX',
    employees: '100–150',
    revenue: '$12M',
    keyContact: 'Priya Sharma',
    designation: 'Co-Founder',
    email: 'priya@tinygenius.com',
    phone: '+1 (512) 555-0978',
    linkedin: 'linkedin.com/in/priyasharma',
    website: 'www.tinygenius.com',
    coreToyCategory: 'STEM / Educational',
    ageGroupFocus: '3–5 years',
    materialExpertise: 'Wood, Electronic, Silicone',
    productPositioning: 'Mid-range',
    manufacturingModel: 'Outsourced (Vietnam)',
    productionCapacity: '500K units/year',
    certifications: 'ASTM F963, CPSIA',
  },
  {
    companyName: 'CardMasters Ltd.',
    yearEstablished: 2010,
    headquarters: 'Seattle, WA',
    employees: '400–600',
    revenue: '$55M',
    keyContact: 'Kevin Tanaka',
    designation: 'Director of Sales',
    email: 'k.tanaka@cardmasters.com',
    phone: '+1 (206) 555-1045',
    linkedin: 'linkedin.com/in/kevintanaka',
    website: 'www.cardmasters.com',
    coreToyCategory: 'Collectibles & Hobby',
    ageGroupFocus: '5–12 years, Teens & Adults',
    materialExpertise: 'Paper/Card, Holographic Film',
    productPositioning: 'Mass-market / Premium',
    manufacturingModel: 'In-house',
    productionCapacity: '15M packs/year',
    certifications: 'ASTM F963, CPSIA',
  },
  {
    companyName: 'GreenPlay Naturals',
    yearEstablished: 2016,
    headquarters: 'Denver, CO',
    employees: '80–120',
    revenue: '$9M',
    keyContact: 'Hannah Brooks',
    designation: 'CEO',
    email: 'hannah@greenplay.com',
    phone: '+1 (720) 555-1123',
    linkedin: 'linkedin.com/in/hannahbrooks',
    website: 'www.greenplaynaturals.com',
    coreToyCategory: 'Other Toys',
    ageGroupFocus: '0–3 years',
    materialExpertise: 'Organic Cotton, Wood, Natural Rubber',
    productPositioning: 'Premium',
    manufacturingModel: 'In-house',
    productionCapacity: '200K units/year',
    certifications: 'ASTM F963, CPSIA, GOTS, FSC',
  },
  {
    companyName: 'RoboKidz Technologies',
    yearEstablished: 2014,
    headquarters: 'San Francisco, CA',
    employees: '250–400',
    revenue: '$35M',
    keyContact: 'Alex Nguyen',
    designation: 'CTO & Co-Founder',
    email: 'alex@robokidz.com',
    phone: '+1 (415) 555-1267',
    linkedin: 'linkedin.com/in/alexnguyen',
    website: 'www.robokidz.com',
    coreToyCategory: 'Electronic & Tech-Enabled',
    ageGroupFocus: '5–12 years',
    materialExpertise: 'Electronic, AI/ML, Plastic',
    productPositioning: 'Premium',
    manufacturingModel: 'Outsourced (Taiwan)',
    productionCapacity: '600K units/year',
    certifications: 'ASTM F963, CPSIA, FCC',
  },
  {
    companyName: 'ActionForce Global',
    yearEstablished: 1992,
    headquarters: 'Atlanta, GA',
    employees: '3,000–3,500',
    revenue: '$420M',
    keyContact: 'Michael Carter',
    designation: 'President, North America',
    email: 'm.carter@actionforce.com',
    phone: '+1 (404) 555-1389',
    linkedin: 'linkedin.com/in/michaelcarter',
    website: 'www.actionforcetoys.com',
    coreToyCategory: 'Licensed / Theme Toys',
    ageGroupFocus: '3–12 years',
    materialExpertise: 'Plastic, Die-cast, Electronic',
    productPositioning: 'Mass-market',
    manufacturingModel: 'Hybrid',
    productionCapacity: '15M units/year',
    certifications: 'ASTM F963, CPSIA, EN71, ISO 8124',
  },
  {
    companyName: 'MagnaBlocks Inc.',
    yearEstablished: 2011,
    headquarters: 'Minneapolis, MN',
    employees: '300–450',
    revenue: '$38M',
    keyContact: 'Jennifer Liu',
    designation: 'VP Marketing',
    email: 'j.liu@magnablocks.com',
    phone: '+1 (612) 555-1456',
    linkedin: 'linkedin.com/in/jenniferliu',
    website: 'www.magnablocks.com',
    coreToyCategory: 'Construction & Block-Building',
    ageGroupFocus: '3–5 years',
    materialExpertise: 'Magnetic, ABS Plastic',
    productPositioning: 'Mid-range / Premium',
    manufacturingModel: 'Outsourced (China)',
    productionCapacity: '2M units/year',
    certifications: 'ASTM F963, CPSIA, EN71',
  },
]

// Column groups for the colored headers
const COLUMN_GROUPS = [
  {
    label: 'COMPANY INFORMATION',
    color: 'bg-green-100 text-green-900',
    columns: ['companyName', 'yearEstablished', 'headquarters', 'employees', 'revenue'] as const,
  },
  {
    label: 'CONTACT DETAILS',
    color: 'bg-blue-100 text-blue-900',
    columns: ['keyContact', 'designation', 'email', 'phone', 'linkedin', 'website'] as const,
  },
  {
    label: 'PRODUCT PORTFOLIO / SUPPLY OFFERING',
    color: 'bg-green-100 text-green-900',
    columns: ['coreToyCategory', 'ageGroupFocus', 'materialExpertise', 'productPositioning'] as const,
  },
  {
    label: 'SUPPLY & OPERATIONAL CAPABILITY',
    color: 'bg-blue-100 text-blue-900',
    columns: ['manufacturingModel', 'productionCapacity', 'certifications'] as const,
  },
]

const COLUMN_HEADERS: Record<string, string> = {
  companyName: 'Company Name',
  yearEstablished: 'Year Established',
  headquarters: 'Headquarters',
  employees: 'No. of Employees (est.)',
  revenue: 'Revenue/Turnover (if available)',
  keyContact: 'Key Contact Person',
  designation: 'Designation / Role',
  email: 'Email Address (verified / generic)',
  phone: 'Phone / WhatsApp Number',
  linkedin: 'LinkedIn Profile',
  website: 'Website URL',
  coreToyCategory: 'Core Toy Category Supplied',
  ageGroupFocus: 'Age Group Focus',
  materialExpertise: 'Material Expertise (Plastic, Plush, Wood, Electronic, etc.)',
  productPositioning: 'Product Positioning (Mass-market / Mid-range / Premium)',
  manufacturingModel: 'Manufacturing Model (In-house / Outsourced / Hybrid)',
  productionCapacity: 'Production Capacity / Scale',
  certifications: 'Certifications Compliance (ASTM F963, CPSIA, EN71 etc.) if Available',
}

type SortField = keyof SupplierData
type SortDir = 'asc' | 'desc'

interface Props {
  title?: string
  height?: number
}

export default function SupplierIntelligenceTable({ title = 'Supplier Intelligence Database', height = 600 }: Props) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('companyName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filtered = useMemo(() => {
    let data = [...DEMO_SUPPLIERS]
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(s =>
        Object.values(s).some(v => String(v).toLowerCase().includes(q))
      )
    }
    data.sort((a, b) => {
      const aVal = String(a[sortField])
      const bVal = String(b[sortField])
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return data
  }, [search, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleExportCSV = () => {
    const allCols = COLUMN_GROUPS.flatMap(g => g.columns)
    const header = allCols.map(c => COLUMN_HEADERS[c]).join(',')
    const rows = filtered.map(row =>
      allCols.map(c => `"${String(row[c]).replace(/"/g, '""')}"`).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'supplier_intelligence.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: height }}>
          <table className="min-w-full text-xs">
            {/* Group Header Row */}
            <thead className="sticky top-0 z-20">
              <tr>
                {COLUMN_GROUPS.map(group => (
                  <th
                    key={group.label}
                    colSpan={group.columns.length}
                    className={`px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide border-b border-r border-gray-300 ${group.color}`}
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
              {/* Column Header Row */}
              <tr className="bg-gray-50">
                {COLUMN_GROUPS.flatMap(group =>
                  group.columns.map(col => (
                    <th
                      key={col}
                      onClick={() => handleSort(col as SortField)}
                      className="px-2 py-2 text-left text-[10px] font-semibold text-gray-700 border-b border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100 min-w-[120px]"
                    >
                      <div className="flex items-center gap-1">
                        <span>{COLUMN_HEADERS[col]}</span>
                        {sortField === col && (
                          sortDir === 'asc'
                            ? <ChevronUp className="h-3 w-3 text-blue-600" />
                            : <ChevronDown className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((supplier, idx) => (
                <tr key={supplier.companyName} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {COLUMN_GROUPS.flatMap(group =>
                    group.columns.map(col => (
                      <td
                        key={col}
                        className="px-2 py-2 text-xs text-gray-700 border-r border-gray-100 whitespace-nowrap"
                      >
                        {String(supplier[col])}
                      </td>
                    ))
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMN_GROUPS.reduce((sum, g) => sum + g.columns.length, 0)}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No suppliers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-gray-400">
        Showing {filtered.length} of {DEMO_SUPPLIERS.length} suppliers
      </p>
    </div>
  )
}
