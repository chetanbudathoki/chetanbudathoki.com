document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/members")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch members data");
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector("#datatable1 tbody");
            tbody.innerHTML = ""; // Clear any existing rows

            data.forEach(member => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${member.id}</td>
                    <td>${member.first_name}</td>
                    <td>${member.last_name}</td>
                    <td>${member.middle_name || ''}</td>
                    <td>${member.email_id}</td>
                    <td>${member.mobile_number}</td>
                    <td>${member.gender}</td>
                    <td>${member.dob}</td>
                    <td>${member.blood_group || ''}</td>
                    <td>${member.permanent_district}</td>
                    <td>${member.permanent_palika}</td>
                    <td>${member.permanent_wada}</td>
                    <td>${member.permanent_tole}</td>
                    <td>${member.temporary_district}</td>
                    <td>${member.temporary_palika}</td>
                    <td>${member.temporary_wada}</td>
                    <td>${member.temporary_tole}</td>
                    <td>${member.created_at}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching members data:", error);
        });
});
