<!-- Encabezado con banner estilizado -->
<div align="center">
  <img src="https://github.com/microsoft/PowerBI-Embedded/raw/master/assets/PowerBI-Logo.png" width="180"/>
  <h1>📊 Power BI Dashboard Portfolio</h1>
  <p>Interactive data visualization solutions for business intelligence</p>
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=flat&logo=powerbi" alt="Portfolio Version">
</div>

---

## 🌟 Featured Dashboards

<div align="center">

| Dashboard | Description | Technologies | Preview |
|-----------|-------------|--------------|---------|
| **[BD Cursos](./BD_cursos.pbix)**<br>📚 | Comprehensive academic performance analysis with enrollment metrics | <img src="https://img.shields.io/badge/Power_Query-F2C811?style=flat&logo=powerbi" width="80"> <img src="https://img.shields.io/badge/DAX-FF9E0F?style=flat" width="50"> | <a href="./BD_cursos.pbix"><img src="./BD_cursos_page-0001.jpg" width="200"></a> |
| **[HR Analytics](./HR-Dashboard.pbix)**<br>👥 | Employee turnover and performance metrics | <img src="https://img.shields.io/badge/Bookmarks-217346?style=flat&logo=powerbi" width="80"> <img src="https://img.shields.io/badge/Tooltips-0078D4?style=flat" width="70"> | <a href="./HR-Dashboard.pbix"><img src="./hr-preview.jpg" width="200"></a> |
| **[Financial Overview](./Financial-Report.pbix)**<br>💰 | Quarterly financial statements with trend analysis | <img src="https://img.shields.io/badge/Custom_Visuals-9146FF?style=flat" width="100"> <img src="https://img.shields.io/badge/Drill_Through-FF6F00?style=flat" width="80"> | <a href="./Financial-Report.pbix"><img src="./finance-preview.jpg" width="200"></a> |

</div>

---

## 🛠️ Technical Specifications

```powerbi
// Sample DAX from BD Cursos dashboard
Enrollment_Rate = 
VAR Total_Students = COUNTROWS(Students)
VAR Active_Students = CALCULATE(COUNTROWS(Students), 
    FILTER(Students, Students[Status] = "Active"))
RETURN DIVIDE(Active_Students, Total_Students, 0)
