#include <iostream>
#include <string>
#include <bitset>
using namespace std;
int main() {
    string cover_text, secret_text;
    cout << "Enter the cover text: ";
    getline(cin, cover_text);
    cout << "\nEnter the secret message: ";
    getline(cin, secret_text);
    string binary_secret = "";
    for(int i = 0; i < secret_text.size(); i++)
    {
        binary_secret += bitset<8>(secret_text[i]).to_string();
    }
    string hidden_payload = ""; 
    for(auto x : binary_secret)
    {
        if(x == '0')
        {
            hidden_payload += "\xE2\x80\x8B"; 
        }
        else
        {
            hidden_payload += "\xE2\x80\x8C"; 
        }
    }
    string final_result = cover_text + hidden_payload;
    cout << final_result << endl;
    return 0;
}