// Firebase Cloud Function: importDriverBehaviorWebhook
// Accepts POST requests from Google Sheets Web Book and writes driver behavior events to Firestore

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.importDriverBehaviorWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    let events = req.body;
    if (!Array.isArray(events)) {
        return res.status(400).json({ error: 'Payload must be an array of events.' });
    }

    const db = admin.firestore();
    const batch = db.batch();
    let successCount = 0;
    let errorCount = 0;

    events.forEach(event => {
        if (!event.id) {
            errorCount++;
            return;
        }
        const ref = db.collection('driverBehavior').doc(event.id);
        batch.set(ref, event, { merge: true });
        successCount++;
    });

    try {
        await batch.commit();
        return res.status(200).json({ success: true, inserted: successCount, errors: errorCount });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Cloud Function: importTripsFromWebBook
exports.importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    let trips = req.body;
    if (!Array.isArray(trips)) {
        return res.status(400).json({ error: 'Payload must be an array of trips.' });
    }

    const db = admin.firestore();
    const batch = db.batch();
    let successCount = 0;
    let errorCount = 0;

    trips.forEach(trip => {
        if (!trip.id) {
            errorCount++;
            return;
        }
        const ref = db.collection('trips').doc(trip.id);
        batch.set(ref, trip, { merge: true });
        successCount++;
    });

    try {
        await batch.commit();
        return res.status(200).json({ success: true, inserted: successCount, errors: errorCount });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
