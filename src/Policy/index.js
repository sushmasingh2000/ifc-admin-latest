import { Card, CardContent, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Card sx={{ maxWidth: 800, width: "100%", p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Privacy Policy for Gram Swachhata Sathi    </Typography>
                    <Typography variant="subtitle2" color="textSecondary"  gutterBottom>
                        Effective Date: December 12, 2025
                    </Typography>
                    {/* <Typography variant="body1" paragraph>
                        Developer / Owner: Panchayati Raj Department, Balrampur
                    </Typography> */}

                    <Typography variant="body1" paragraph>
                        Gram Swachhata Sathi (“the app”, “we”, “our”, “us”) is an attendance management system developed exclusively for authorized employees of the Panchayati Raj Department, Balrampur. The app is designed to mark daily attendance by capturing the employee’s current location and a photo at the time of marking attendance.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Information We Collect:</strong> Attendance Image and Location Data (GPS coordinates). No other personal information or device data is collected.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>How We Use the Information:</strong> The collected data is used solely for verifying attendance and location authenticity.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Data Storage and Retention:</strong> Attendance images and location data are securely stored on authorized servers and retained only as required by departmental policies.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Data Sharing and Disclosure:</strong> No data is shared, sold, or disclosed to third parties. Only authorized departmental officials have access.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>User Accounts and Access:</strong> Only pre-authorized personnel can log in using credentials provided directly by the Panchayati Raj Department.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Permissions Used:</strong> Camera and Location permissions are required solely for attendance marking.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Data Security:</strong> We follow appropriate security measures, but note that no method of transmission or storage is completely secure.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Children’s Privacy:</strong> Not intended for use by children under 18 years of age.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Changes to This Policy:</strong> Any updates will be reflected here with a revised date.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Contact Us:</strong> For any questions or concerns, please contact: <span className="text-blue-800">balram0198810@gmail.com</span>

                    </Typography>
                </CardContent>
            </Card>
        </Box>

    );
};

export default PrivacyPolicy;
