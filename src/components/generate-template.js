import * as XLSX from 'xlsx';

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  [
    'id',
    'name',
    'slug',
    'oem',
    'price',
    'category',
    'subcategory',
    'brand',
    'model',
    'modification',
    'images',
    'description',
    'characteristics',
    'marketplaces',
    'distributors',
    'metaTitle',
    'metaDescription',
    'status'
  ],
  [
    '123', 
    'Тормозные колодки HETT', 
    'tormoznye-kolodki-hett',
    'HT-BP-1234',
    '2500',
    'brakes',
    'disc-brakes',
    'toyota',
    'camry',
    'camry-3.5-v6',
    'HT-BP-1234-1.jpg,HT-BP-1234-2.jpg',
    'Высококачественные тормозные колодки HETT для Toyota Camry. Обеспечивают эффективное торможение и длительный срок службы.',
    'OEM:HT-BP-1234,Weight:0.5kg,Material:Ceramic',
    'ozon:https://ozon.ru/product/123,wildberries:https://wb.ru/product/456',
    'Name:Auto Parts,Address:Moscow,Phone:+7499123456,URL:https://autoparts.ru',
    'Купить тормозные колодки HETT для Toyota Camry',
    'Высококачественные керамические тормозные колодки HETT для Toyota Camry. Доставка по России.',
    'published'
  ],
  [
    '', 
    'Масляный фильтр HETT', 
    'maslyanyy-filtr-hett',
    'HT-OF-5678',
    '800',
    'filters',
    'oil-filters',
    'toyota',
    'rav4',
    'rav4-2.0-2019',
    'HT-OF-5678-1.jpg',
    'Высококачественный масляный фильтр HETT для Toyota RAV4. Обеспечивает надежную фильтрацию и защиту двигателя.',
    'OEM:HT-OF-5678,Weight:0.2kg,Material:Synthetic',
    'ozon:https://ozon.ru/product/456',
    'Name:FilterShop,Address:Saint Petersburg,Phone:+7812123456,URL:https://filtershop.ru',
    'Купить масляный фильтр HETT для Toyota RAV4',
    'Масляный фильтр HETT для Toyota RAV4 с двигателем 2.0. Высокое качество фильтрации. Доставка по всей России.',
    'draft'
  ]
]);

// Set column widths
const columnWidths = [
  { wch: 10 },  // id
  { wch: 30 },  // name
  { wch: 30 },  // slug
  { wch: 15 },  // oem
  { wch: 10 },  // price
  { wch: 20 },  // category
  { wch: 20 },  // subcategory
  { wch: 15 },  // brand
  { wch: 15 },  // model
  { wch: 20 },  // modification
  { wch: 40 },  // images
  { wch: 60 },  // description
  { wch: 50 },  // characteristics
  { wch: 60 },  // marketplaces
  { wch: 60 },  // distributors
  { wch: 40 },  // metaTitle
  { wch: 60 },  // metaDescription
  { wch: 15 }   // status
];
ws['!cols'] = columnWidths;

// Add instructions sheet
const instructionsSheet = XLSX.utils.aoa_to_sheet([
  ['Инструкции по импорту продуктов в Hett Automotive CMS'],
  [''],
  ['Основные правила:'],
  ['1. Первая строка содержит заголовки - НЕ ИЗМЕНЯЙТЕ их'],
  ['2. Обязательные поля: name, slug, oem, category'],
  ['3. Оставьте поле id пустым для создания новых продуктов'],
  ['4. Используйте существующие slug категорий и подкатегорий'],
  ['5. Изображения должны быть загружены в медиа-библиотеку до импорта'],
  [''],
  ['Форматы данных:'],
  ['images - Список имен файлов через запятую: image1.jpg,image2.jpg'],
  ['characteristics - Формат: Ключ:Значение,Ключ2:Значение2'],
  ['marketplaces - Формат: платформа:url,платформа2:url2'],
  ['distributors - Формат: Name:Название,Address:Адрес,Phone:Телефон,URL:Вебсайт'],
  ['status - Допустимые значения: published, draft'],
]);

// Set column width for instructions
instructionsSheet['!cols'] = [{ wch: 80 }];

// Add the worksheets to the workbook
XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Инструкции');
XLSX.utils.book_append_sheet(wb, ws, 'Шаблон продуктов');

// Write to file
XLSX.writeFile(wb, 'product_import_template.xlsx');

console.log('Template file created: product_import_template.xlsx');