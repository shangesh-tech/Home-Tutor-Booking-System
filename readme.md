# Art Workshop Registration System

## Project:
Users register for workshops hosted by artists.

## Schemas:
- **User**: 
  - `name`: String, required
  - `email`: String, required, unique
  - `role`: ['attendee', 'artist'], required
- **Workshop**: 
  - `title`: String, required
  - `date`: Date, required
  - `artistId`: ObjectId (ref: 'User'), required
  - `attendeeIds`: Array of User references (attendees)

## Endpoints:
- **POST /register**: Create a user.
- **POST /workshops**: Create a workshop.
- **POST /workshops/:id/register**: Add an attendee to a workshop.

---

## Code Solution:

```javascript
import express from 'express';
import mongoose from 'mongoose';

// Define Mongoose Schemas
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['attendee', 'artist'], required: true },
});

const User = mongoose.model('User', userSchema);

// Workshop Schema
const workshopSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Workshop = mongoose.model('Workshop', workshopSchema);

// Initialize Express app
const app = express();
app.use(express.json()); // For parsing application/json

// Register for workshop - POST /workshops/:id/register
app.post('/workshops/:id/register', async (req, res) => {
  const workshopId = req.params.id;
  const { userId } = req.body;

  try {
    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate that the user is an attendee (can't register if they're an artist)
    if (user.role !== 'attendee') {
      return res.status(400).json({ message: 'Only attendees can register for workshops' });
    }

    // Find the workshop by ID
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check if the user is already registered
    if (workshop.attendeeIds.includes(userId)) {
      return res.status(400).json({ message: 'User is already registered for this workshop' });
    }

    // Add user to the workshop's attendees list
    workshop.attendeeIds.push(userId);
    await workshop.save();

    // Respond with the updated workshop
    return res.status(200).json({ message: 'User successfully registered for workshop', workshop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/artworkshop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
```

---

# Mentor Matching Platform

## Project:

Connect students with industry mentors.

## Schemas:

* **User**:

  * `name`: String, required
  * `email`: String, required, unique
  * `role`: \['student', 'mentor'], required
* **Mentorship**:

  * `topic`: String, required
  * `date`: Date, required
  * `mentorId`: ObjectId (ref: 'User'), required
  * `studentId`: ObjectId (ref: 'User'), required

## Endpoints:

* **POST /register**: Add a user.
* **POST /mentorships**: Schedule a session.

## Validation:

* Role must be correct.
* Ensure both users exist.
* Limit to 1 mentorship per student per topic per week.

---

## Code Solution:

```javascript
const workshopSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  topic: { type: String, required: true },  // Added the topic field
});

app.post('/workshops/:id/register', async (req, res) => {
  const workshopId = req.params.id;
  const { userId } = req.body;

  try {
    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate that the user is an attendee (can't register if they're an artist)
    if (user.role !== 'attendee') {
      return res.status(400).json({ message: 'Only attendees can register for workshops' });
    }

    // Find the workshop by ID
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check if the user is already registered
    if (workshop.attendeeIds.includes(userId)) {
      return res.status(400).json({ message: 'User is already registered for this workshop' });
    }

    // Get the start of the week for comparing the dates
    const startOfWeek = new Date(workshop.date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday of the current week
    startOfWeek.setHours(0, 0, 0, 0); // Set to midnight

    // Check if the user is already registered for any workshop with the same topic in the same week
    const existingMentorship = await Workshop.findOne({
      topic: workshop.topic,
      attendeeIds: userId,
      date: { $gte: startOfWeek, $lt: new Date(startOfWeek).setDate(startOfWeek.getDate() + 7) }, // Filter for the same week
    });

    if (existingMentorship) {
      return res.status(400).json({ message: 'User can only register for 1 mentorship per topic per week' });
    }

    // Add user to the workshop's attendees list
    workshop.attendeeIds.push(userId);
    await workshop.save();

    // Respond with the updated workshop
    return res.status(200).json({ message: 'User successfully registered for workshop', workshop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
```

//SQL


---

**1. You want to add a new product to the catalog. Which SQL command should you use?**
✅ **B. INSERT**
**Explanation:** The `INSERT` command is used to add new records (like a new product) into a table.

---

**2. You need to list all users who have registered. What SQL command will you use?**
✅ **B. SELECT**
**Explanation:** The `SELECT` statement is used to query data from a table, in this case, to list all registered users.

---

**3. A customer updates the quantity of an order. Which command will help you?**
✅ **A. UPDATE Orders SET quantity = 2 WHERE id = 1;**
**Explanation:** The `UPDATE` command modifies existing data in a table. Here, it updates the quantity for a specific order.

---

**4. You want to permanently remove a product that's discontinued. Which SQL command do you use?**
✅ **C. DELETE FROM Products WHERE id=5;**
**Explanation:** The `DELETE` command removes specific rows (like a discontinued product) from a table.

---

**5. You want to allow a manager to update product stock levels. Which SQL command is related to permissions?**
✅ **A. GRANT**
**Explanation:** The `GRANT` command is used to give users specific privileges, like the ability to update a table.

---

**6. To add a new column 'discount' to Products, you would use:**
✅ **A. ALTER TABLE Products ADD discount INT;**
**Explanation:** The `ALTER TABLE` command with `ADD` adds a new column to an existing table.

---

**7. You accidentally updated wrong prices. Which command can help undo changes?**
✅ **B. ROLLBACK**
**Explanation:** The `ROLLBACK` command undoes changes made in the current transaction before a `COMMIT`.

---

**8. After successfully adding a bulk list of products, which command saves the changes?**
✅ **A. COMMIT**
**Explanation:** The `COMMIT` command saves all changes made during the transaction to the database.

---

**9. You realize you need a new table for product reviews. Which command creates it?**
✅ **B. CREATE**
**Explanation:** The `CREATE` command is used to create new database objects such as tables.

---

**10. Which SQL command changes the structure of an existing table without removing data?**
✅ **B. ALTER**
**Explanation:** The `ALTER` command modifies the structure of a table (e.g., add/remove columns) without affecting the data.

---
