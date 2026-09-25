// MSW Handlers for Authentication & Customer Profile
import { http, HttpResponse, delay } from "msw";
import { mockDb } from "../data/mockStore";

const formatSuccess = (data, message = "Operation successful") => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
  ...(data && typeof data === "object" ? data : {})
});

const formatError = (code, message) => ({
  success: false,
  errorCode: "AUTH_ERROR",
  errorMessage: message,
  messageToShow: message,
});

export const authHandlers = [
  // Login
  http.post("*/api/auth/login", async ({ request }) => {
    await delay(180);
    const { email, password } = await request.json();

    const existingUser = mockDb.findUserByEmail(email);
    if (!existingUser) {
      // For demo convenience, allow signing in as a customer if not found
      const created = mockDb.createUser({
        name: email.split("@")[0].replace(".", " "),
        email,
        role: "customer"
      });
      return HttpResponse.json(
        formatSuccess({ user: created, token: created.token }, "Welcome to VEYRA"),
        { status: 200 }
      );
    }

    return HttpResponse.json(
      formatSuccess(
        {
          user: existingUser,
          token: existingUser.token
        },
        "Welcome back to your sanctuary"
      )
    );
  }),

  // Register
  http.post("*/api/auth/register", async ({ request }) => {
    await delay(220);
    const body = await request.json();
    const existing = mockDb.findUserByEmail(body.email);

    if (existing) {
      return HttpResponse.json(formatError(400, "An account with this email already exists"), { status: 400 });
    }

    const newUser = mockDb.createUser({
      name: body.name || "Patron",
      email: body.email,
      role: body.role || "customer",
      phone: body.phone || ""
    });

    return HttpResponse.json(
      formatSuccess({ user: newUser, token: newUser.token }, "Account registered successfully"),
      { status: 201 }
    );
  }),

  // Current User / Profile
  http.get("*/api/auth/profile", async ({ request }) => {
    await delay(100);
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return HttpResponse.json(formatError(401, "No authentication token provided"), { status: 401 });
    }
    // Return Aria Thorne as default customer profile if mock token
    const user = mockDb.users[0];
    return HttpResponse.json(formatSuccess(user, "Profile retrieved"));
  }),

  http.get("*/api/auth/me", async ({ request }) => {
    await delay(100);
    const user = mockDb.users[0];
    return HttpResponse.json(formatSuccess(user, "Profile retrieved"));
  }),

  // Update Profile
  http.put("*/api/auth/profile", async ({ request }) => {
    await delay(150);
    const updates = await request.json();
    const user = mockDb.updateUser(mockDb.users[0]._id, updates);
    return HttpResponse.json(formatSuccess(user, "Profile details updated"));
  }),

  // Saved Addresses
  http.get("*/api/auth/addresses", async () => {
    await delay(100);
    const addresses = mockDb.users[0]?.savedAddresses || [];
    return HttpResponse.json(formatSuccess(addresses, "Addresses retrieved"));
  }),

  http.post("*/api/auth/addresses", async ({ request }) => {
    await delay(150);
    const address = await request.json();
    const newAddr = {
      _id: "66f44d5c9e2b1a3d" + Math.random().toString(16).substring(2, 10),
      ...address
    };
    mockDb.users[0].savedAddresses.push(newAddr);
    mockDb.updateUser(mockDb.users[0]._id, { savedAddresses: mockDb.users[0].savedAddresses });
    return HttpResponse.json(formatSuccess(newAddr, "Address added to your sanctuary address book"), { status: 201 });
  }),

  // Logout
  http.post("*/api/auth/logout", async () => {
    await delay(80);
    return HttpResponse.json(formatSuccess({ loggedOut: true }, "Signed out safely"));
  })
];
